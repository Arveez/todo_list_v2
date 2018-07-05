<?php

namespace App\Controller;

use App\Entity\Item;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ItemListRepository;

class ItemController extends AbstractController
{
    /**
     * @Route("/item/add/{listName}/{itemName}", name="item_add")
     */
    public function add($listName, $itemName, ItemListRepository $repository)
    {
        $em = $this->getDoctrine()->getManager();

        $item = new Item();
        $item->setName($itemName);


        $list = $repository->findOneBy(array(
            'name' => $listName,
            'owner' => $this->getUser()
            ));
        $list->addItem($item);

        $item->setList($list);

        $em->persist($list);

        $em->flush();

        return new Response(json_encode([
            'listName' => $list->getName(),
            'itemName' => $item->getName(),
            'itemId' => $item->getId()
        ]));
    }
    /**
     * @Route("/item/delete/{id}", name="item_delete")
     */
    public function delete(Item $item)
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($item);
        $em->flush();

        return new Response(json_encode([
            'itemId' => $item->getId()
        ]));
    }
}
