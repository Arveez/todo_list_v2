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
use App\Entity\ItemList;
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

        $lisName = $msg[0];
        $articleName = $msg[1];

        $controller = new  ItemController();
        $em = $this->container->get('doctrine')->getManager();

        $itemList = $em->getRepository(ItemList::class)->findBy(['name' => $lisName]);

        $controller->add($itemList[0], $articleName);

        $from->send($msg);
/*        var_dump(json_decode($msg));
        if (!is_numeric($msg)) {

            $lastInsertedItem = $this->add($msg);
            $lastInsertedItem = json_encode($lastInsertedItem);

            foreach ($this->clients as $client) {
                $client->send($lastInsertedItem);
            }

        } else {

            $this->remove($msg);
            foreach ($this->clients as $client) {
                $client->send($msg);
            }
        }*/
    }

    // custom methods

    public function add ($name) {

        $em = $this->container->get('doctrine')->getManager();
        $item = new Item();
        $item->setName($name);
        $em->persist($item);
        $em->flush();

        $lastInsertedItem['id'] = $item->getId();
        $lastInsertedItem['name'] = $item->getName();

        return $lastInsertedItem;

    }
    public function remove($id) {

        $em = $this->container->get('doctrine')->getManager();
        $repo = $em->getRepository('App:Item');

        $item = $repo->find($id);
        $em->remove($item);

        $em->flush();
    }
}