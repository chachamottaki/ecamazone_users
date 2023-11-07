const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./models/index');
const User = db.User;
const sequelize = require('./db.js');




const app = express();
const port = process.env.PORT || 3000;

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
    const { username, email, address, paymentMethod, password } = req.body;
  
    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
  
    User.create({
      username,
      email,
      address,
      paymentMethod,
      password: hashedPassword, // Stockez le mot de passe haché dans la base de données
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
  const { username, email, address, paymentMethod } = req.body;
  User.update(
    { username, email, address, paymentMethod },
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

app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
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
      res.status(200).json({ message: 'Connexion réussie' });
    } else {
      res.status(401).json({ error: 'Mauvais mot de passe' });
    }
  });
  