<?php declare(strict_types = 1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20180228102235 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE item_list (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE item_list_item (item_list_id INT NOT NULL, item_id INT NOT NULL, INDEX IDX_560FEC0736F330DF (item_list_id), INDEX IDX_560FEC07126F525E (item_id), PRIMARY KEY(item_list_id, item_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE item_list_item ADD CONSTRAINT FK_560FEC0736F330DF FOREIGN KEY (item_list_id) REFERENCES item_list (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE item_list_item ADD CONSTRAINT FK_560FEC07126F525E FOREIGN KEY (item_id) REFERENCES item (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE item_list_item DROP FOREIGN KEY FK_560FEC0736F330DF');
        $this->addSql('DROP TABLE item_list');
        $this->addSql('DROP TABLE item_list_item');
    }
}
