<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class DefaultController extends AbstractController
{
    public function index()
    {
        $url = $this->generateUrl('default', [
            'page' => 2,
            'visibility' => 'hidden'
        ]);
        $absoluteUrl = $this->generateUrl('default', [], UrlGeneratorInterface::ABSOLUTE_URL);

        return new Response($this->render('template.html.twig', [
            'initialArticles' => json_encode(['eau', 'pain', 'fromage', 'cafe'])
        ]));
        //return new Response("boota : " . $url . "\n" . $absoluteUrl);

    }
    public function returnTest() {

        return new Response ("return !!");

    }
}