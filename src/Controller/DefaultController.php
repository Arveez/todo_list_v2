<?php

namespace App\Controller;

use App\Form\ItemListType;
use App\Repository\ItemListRepository;
use App\Repository\ItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\ItemList;

class DefaultController extends Controller
{
    /**
     * @param ItemRepository $repository
     * @Route("/", name="home")
     */
    public function index(ItemListRepository $repository): Response
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
            for ($i = 0; $i < count($itemsArray); $i++) {
                $refactoredLists[$name][$i]['id'] = $itemsArray[$i]->getId();
                $refactoredLists[$name][$i]['name'] = $itemsArray[$i]->getName();
            }
        }

        $itemList = new ItemList();
        $newListForm = $this->createForm(ItemListType::class, $itemList, array(
            'action' => $this->generateUrl("list_create")
        ));

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
    public function admin()
    {
        return new Response("admin");
    }
}
