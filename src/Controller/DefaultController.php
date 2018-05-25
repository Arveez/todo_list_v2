<?php

namespace App\Controller;

use App\Form\ItemListType;
use App\Repository\ItemListRepository;
use App\Repository\ItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\ItemList;
use Symfony\Component\Serializer\Encoder\JsonEncode;

class DefaultController extends Controller
{
    /**
     * @return Response
     * @Route("/")
     */
    public function index()
    {
        return new Response($this->redirectToRoute("home"));
    }

    /**
     * @param ItemRepository $repository
     * @Route("/home/{currentView}", name="home", defaults={ "currentView" : null })
     */
    public function home(ItemListRepository $repository, Request $request): Response
    {

        $lists = $repository->findBy(array(
            'owner' => $this->getUser()
        ));
        $refactoredLists = [];
        $listNames = [];
        foreach ($lists as $list) {

            $name = $list->getName();
            $listNames[] = $name;

            $itemsArray = $list->getItems();
            $count = count($itemsArray);
            if ($count > 0) {
                for ($i = 0; $i < count($itemsArray); $i++) {
                    $refactoredLists[$name][$i]['id'] = $itemsArray[$i]->getId();
                    $refactoredLists[$name][$i]['name'] = $itemsArray[$i]->getName();
                }
            } else {
                $refactoredLists[$name] = [];
            }
        }

        $itemList = new ItemList();
        $newListForm = $this->createForm(ItemListType::class, $itemList);


        return new Response($this->renderView('dynTemplate.html.twig', [
            'lists' => $refactoredLists,
            'listNames' => $listNames,
            'newListForm' => $newListForm->createView()
        ]));
    }


    /**
     * @return Response
     * @Route("/admin", name="admin")
     */
    public
    function admin()
    {
        return new Response("admin");
    }
}
