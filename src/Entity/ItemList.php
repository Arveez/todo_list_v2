<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ItemListRepository")
 */
class ItemList
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="lists")
     */
    private $owner;


    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\Regex(
     *     pattern="#^[a-zA-Z0-9]+$#",
     *     message="Caractères alphanumériques seulement"
     * )
     *
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="Item", mappedBy="list", cascade={"persist", "remove"})
     */
    private $items;

    /**
     * @return mixed
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @param mixed $owner
     */
    public function setOwner($owner): void
    {
        $this->owner = $owner;
    }

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }



    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name): void
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     * @param mixed $items
     */
    public function setItems($items): void
    {
        $this->items = $items;
    }

    // add your own fields

    public function addItem(Item $item) {

        $this->items->add($item);

    }
    public function  removeItem(Item $item) {

        $this->items->remove($item->getId());

    }

}
