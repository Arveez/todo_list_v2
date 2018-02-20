<?php
/**
 * Created by PhpStorm.
 * User: rv
 * Date: 16/02/18
 * Time: 14:57
 */

namespace App\Socket;


use App\Controller\ItemController;
use App\Entity\Item;
use Doctrine\Common\Collections\ArrayCollection;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SocketLogic implements MessageComponentInterface
{
    private $clients;

    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->clients = new ArrayCollection();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->add($conn);
        $conn->send('I\'m the socket server');


    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->removeElement($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $conn->close();
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $em = $this->container->get('doctrine')->getManager();
        $item = new Item();
        $item->setName($msg);
        $em->persist($item);
        $em->flush();


        $from->send($msg);
    }

}