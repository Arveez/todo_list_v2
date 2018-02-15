<?php

namespace App\Controller;

use  Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class DefaultController extends Controller
{
    public function index()
    {
        return new Response($this->render('template.html.twig', [
            'initialArticles' => json_encode(['eau', 'pain', 'fromage', 'cafe'])
        ]));
        //return new Response("boota : " . $url . "\n" . $absoluteUrl);

    }
    public function returnTest() {

        return new Response ("return !! ". $this->container->getParameter('boota'));

    }

    /**
     * @Route("/annotation-route", name="annotaion_route")
     */
    public function annotaitonRouting () {
        return new Response("annotation route in controller");
    }
}