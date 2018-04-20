<?php
/**
 * Created by PhpStorm.
 * User: rv
 * Date: 07/04/18
 * Time: 13:03
 */

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, array('label' => false,
                    'attr'=> array(
                        'placeholder' => 'Email'
                    )))
            ->add('username', TextType::class, array('label' => false,
                    'attr' => array('placeholder' => 'Login'))
            )
            ->add('plainPassword', RepeatedType::class, array(
                'type' => PasswordType::class,
                'first_options' => array('label' => false,
                    'attr' => array(
                        'placeholder' => 'Mot de passe')),
                'second_options' => array('label' => false,
                    'attr' => array(
                        'placeholder' =>'Répéter mot de passe')),
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => User::class,
        ));
    }
}