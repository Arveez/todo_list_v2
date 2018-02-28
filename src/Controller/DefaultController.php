<?php

namespace App\Controller;

use App\Repository\ItemListRepository;
use App\Repository\ItemRepository;
use  Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class DefaultController extends Controller
{

    /**
     * @param ItemRepository $repository
     * @Route("/")
     */
    public function index(ItemListRepository $repository): Response
    {
        $lists = $repository->findAll();
        $refactoredLists = [];
        foreach ($lists as $list) {
            $name = $list->getName();
            $itemsArray = $list->getItems();
            for ($i = 0 ; $i < count($itemsArray) ; $i++) {
                $refactoredLists[$name][$i]['id'] = $itemsArray[$i]->getId();
                $refactoredLists[$name][$i]['name'] = $itemsArray[$i]->getName();
            }

        }
        return new Response($this->renderView('test.html.twig', [
            'lists' => $refactoredLists,
        ]));
    }

}
//            for ($i = 0 ; $i< count($list->getItems()) ; $i++) {
//                ${$list->getName()}[$i]['id'] = $list->getItems[$i]->getId();
//                ${$list->getName()}[$i]['name'] = $list->getItems[$i]->getName();
//            }