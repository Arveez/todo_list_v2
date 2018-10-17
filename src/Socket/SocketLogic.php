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
use Symfony\Component\DependencyInjection\ContainerInterface;

class SocketLogic implements MessageComponentInterface
{
    private $clients;

    private $connectionsAndUserIds;

    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->clients = new ArrayCollection();
        $this->connectionsAndUserIds = [];
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->add($conn);
        echo "new conn\n";
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->removeElement($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        $errMess = $e->getMessage() . "\nIn " . $e->getFile() . "\nLine " . $e->getLine();
        $conn->close();
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $message = json_decode($msg);

        if ($message->{'action'} == 'initial') {
            $this->connectionsAndUserIds[$from->resourceId] = $message->{'userId'};
        } else {

            foreach ($this->clients as $client) {
                if ($this->connectionsAndUserIds[$client->resourceId] == $message->{'userId'}) {
                    $client->send($msg);
                }
            }

        }
    }
}