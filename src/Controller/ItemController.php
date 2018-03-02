<?php

namespace App\Controller;

use App\Entity\Item;
use App\Entity\ItemList;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class ItemController extends AbstractController
{
    /**
     * @Route("/item", name="item")
     */
    public function show()
    {

        $items = $this->getDoctrine()
            ->getRepository(Item::class)
            ->findAll();

        $datas = [];

        for ($i = 0; $i < count($items); $i++) {
            $datas[$i]['id'] = $items[$i]->getId();
            $datas[$i]['name'] = $items[$i]->getName();
        }
        $items = json_encode($datas);

        return new Response($this->render('template.html.twig', [
            'initialArticles' => $items
        ]));

    }

    /**
     * @Route("/add/itemlist/{id}/{name}")
     */
    public function add(ItemList $itemList, $name)
    {
        $em = $this->getDoctrine()->getManager();

        $item = new Item();
        $item->setName($name);
        $itemList->addItem($item);

        $em->persist($itemList);
        $em->flush();

        return new Response();
    }

}
