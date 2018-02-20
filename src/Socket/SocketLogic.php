<?php
/**
 * Created by PhpStorm.
 * User: rv
 * Date: 16/02/18
 * Time: 14:57
 */

namespace App\Socket;


use Doctrine\Common\Collections\ArrayCollection;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SocketLogic extends AbstractController implements MessageComponentInterface
{
    private $clients;

    public function __construct()
    {
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
        $from->send($msg);
    }



}