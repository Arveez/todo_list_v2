<?php

namespace App\Controller;

use App\Entity\ItemList;
use App\Form\ItemListType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ItemListController extends Controller
{
    /**
     * @Route("/list/create", name="list_create")
     */
    public function createList(Request $request)
    {
        $list = new ItemList();
        $form = $this->createForm(ItemListType::class, $list);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $list = $form->getData();
        }

        $manager = $this->getDoctrine()->getManager();
        $manager->persist($list);
        $manager->flush();

        return new Response($this->redirectToRoute("home"));
    }

    /**
     * @param $name
     * @Route("/list/delete/{name}", name="list_delete")
     */
    public function deleteList($name)
    {
        $manager = $this->getDoctrine()->getManager();
        $list = $manager->getRepository(ItemList::class)->findOneBy(array(
            'name' => $name
        ));
        $manager->remove($list);
        $manager->flush();

        return new Response($this->redirectToRoute("home"));
    }
}
