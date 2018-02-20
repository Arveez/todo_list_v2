<?php
/**
 * Created by PhpStorm.
 * User: rv
 * Date: 16/02/18
 * Time: 15:49
 */

namespace App\Socket;


use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class StartCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('todo:server:start')
            ->setDescription('starts ws server');
    }
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $server = IoServer::factory(new HttpServer(
            new WsServer(new SocketLogic($this->getContainer()))
        ),8080);
         $server->run();
   }
}