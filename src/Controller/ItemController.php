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
     * @Route("/add/itemlist/{name}/{articleName}")
     */
    public function add(ItemList $list, $articleName)
    {
        $em = $this->getDoctrine()->getManager();

        $item = new Item();
        $item->setName($articleName);
        $list->addItem($item);

        $em->persist($list);
        $em->flush();

        return new Response(json_encode([
            'listName' => $list->getName(),
            'articleName' => $item->getName(),
            'articleId' => $item->getId()
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
            'articleId' => $item->getId()
        ]));
    }

}
