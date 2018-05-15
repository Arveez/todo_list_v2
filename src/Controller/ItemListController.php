<?php

namespace App\Controller;

use App\Entity\ItemList;
use App\Form\ItemListType;
use App\Repository\ItemListRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ItemListController extends Controller
{
    /**
     * @Route("/itemList/add/{listName}", name="list_add")
     */
    public function createList($listName)
    {
        $list = new ItemList();

            $list->setName($listName);
            $list->setOwner($this->getUser());

            $manager = $this->getDoctrine()->getManager();
            $manager->persist($list);
            $manager->flush();
        return new Response($listName);
    }

    /**
     * @param $name
     * @Route("/itemList/delete/{name}", name="list_delete")
     */
    public function deleteList($name, ItemListRepository $repository)
    {
        $manager = $this->getDoctrine()->getManager();
        $list = $repository->findOneBy(array(
            'name' => $name,
            'owner' => $this->getUser()
        ));
        $manager->remove($list);
        $manager->flush();


        return new Response($this->redirectToRoute("home"));
    }
}
