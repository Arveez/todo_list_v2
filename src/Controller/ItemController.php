<?php

namespace App\Controller;

use App\Entity\Item;
use App\Entity\ItemList;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ItemController extends AbstractController
{
    /**
     * @Route("/add/itemlist/{listName}/{itemName}")
     */
    public function add($listName, $itemName)
    {
        $em = $this->getDoctrine()->getManager();

        $item = new Item();
        $item->setName($itemName);

        $list = $em->getRepository(ItemList::class)->findOneBy(array(
            'name' => $listName,
            'owner' => $this->getUser()
            ));
        $list->addItem($item);

        $em->persist($list);
        $em->flush();

        return new Response(json_encode([
            'listName' => $list->getName(),
            'itemName' => $item->getName(),
            'itemId' => $item->getId()
        ]));
    }
    /**
     * @Route("/delete/item/{id}")
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
