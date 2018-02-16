<?php

namespace App\Controller;

use App\Entity\Item;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;

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

        foreach ($items as $item) {
            $datas[$item->getId()] = $item->getName();
        }
        $items = json_encode($datas);

        return new Response($this->render('template.html.twig', [
            'initialArticles' => $items
        ]));

    }

    /**
     * @param $name
     * @Route("/item/new/{name}")
     */
    public function add($name) {

        $em = $this->getDoctrine()->getManager();
        $item = new Item();
        $item->setName($name);
        $em->persist($item);
        $em->flush();

    }
}
