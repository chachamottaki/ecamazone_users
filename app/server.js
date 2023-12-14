    const express = require('express');
    const bcrypt = require('bcrypt');
    const db = require('./models/index');
    const User = db.User;
    const sequelize = require('./db.js');




    const app = express();
    let cors = require('cors')
    app.use(cors())

    // Synchronisez le modèle avec la base de données (créez la table si elle n'existe pas)
    sequelize.sync()
      .then(() => {
        console.log('Base de données synchronisée');
      })
      .catch((err) => {
        console.error('Erreur lors de la synchronisation de la base de données :', err);
      });

    app.use(express.json());

    // API routes

    // Créer un nouvel utilisateur
    app.post('/users', async (req, res) => {
      const {
          username, fullName, email, phoneNumber, shippingAddress,  password
      } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      User.create({
          username,
          fullName,
          email,
          phoneNumber,
          shippingAddress,
          password: hashedPassword,
      })
      .then((user) => {
          res.status(201).json(user);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Échec de la création de l\'utilisateur' });
      });
  });
  

    // Récupérer un utilisateur par ID
    app.get('/users/:userId', (req, res) => {
      const userId = req.params.userId;
      User.findByPk(userId)
        .then((user) => {
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        });
    });

    // Mise à jour d'un utilisateur par ID
    app.put('/users/:userId', (req, res) => {
      const userId = req.params.userId;
      const {
          username, fullName, email, phoneNumber, shippingAddress, 
      } = req.body;
  
      User.update(
          {
              username, fullName, email, phoneNumber, shippingAddress, 
          },
          { where: { id: userId } }
      )
      .then(([affectedRows]) => {
          if (affectedRows > 0) {
              res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
          } else {
              res.status(404).json({ error: 'Utilisateur non trouvé' });
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Erreur interne du serveur' });
      });
  });
  

    // Supprimer un utilisateur par ID
    app.delete('/users/:userId', (req, res) => {
      const userId = req.params.userId;
      User.destroy({ where: { id: userId } })
        .then((affectedRows) => {
          if (affectedRows > 0) {
            res.status(204).send();
          } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        });
    });
    // Route de connexion
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      // Recherchez l'utilisateur par nom d'utilisateur
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Vérifiez le mot de passe haché
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Renvoyez l'ID de l'utilisateur dans la réponse
        res.status(200).json({ message: 'Connexion réussie', id: user.id });
      } else {
        res.status(401).json({ error: 'Mauvais mot de passe' });
      }
    });
    // Route pour changer le mot de passe
app.post('/change-password/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, newPassword } = req.body;

  try {
      // Trouvez l'utilisateur par ID
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Vérifiez l'ancien mot de passe
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
      }

      // Hachez le nouveau mot de passe et mettez à jour
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



    // Condition pour vérifier si le script est exécuté directement
    if (require.main === module) {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Le serveur fonctionne sur le port ${port}`);
      });
    }



module.exports = app;
