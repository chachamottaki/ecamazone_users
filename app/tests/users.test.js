const request = require('supertest');
const app = require('../server.js'); // Mettez à jour le chemin
const db = require('../models/index');
const User = db.User;

describe('API /users', () => {
    let testUserId;
    let transaction;


    // Avant chaque test, démarrer une transaction et créer un utilisateur de test
    beforeEach(async () => {
      transaction = await sequelize.transaction();
      

      const newUser = {
          username: 'testUser',
          email: 'test@example.com',
          address: '123 Test Street',
          paymentMethod: 'card',
          password: 'password123' // Assurez-vous que le mot de passe est correctement haché si nécessaire
      };

      const createdUser = await User.create(newUser, { transaction });
      testUserId = createdUser.id;
  });

  // Après chaque test, annuler la transaction pour revenir à l'état initial de la base de données
  afterEach(async () => {
      await transaction.rollback();
  });

  it('POST /users - Créer un utilisateur', async () => {
    const newUser = {
      username: 'testUser',
      email: 'test@example.com',
      address: '123 Test Street',
      paymentMethod: 'card',
      password: 'password123'
    };

    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    // Autres assertions...
  });

    // Test pour récupérer un utilisateur par ID
    it('GET /users/:userId - Récupérer un utilisateur', async () => {
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const response = await request(app).get(`/users/${userId}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
        // Autres assertions...
      });
    
      it('PUT /users/:userId - Mettre à jour un utilisateur', async () => {
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const updatedUser = {
          username: 'updatedUser',
          email: 'updated@example.com',
          address: '456 Updated Street',
          paymentMethod: 'updatedCard'
        };
    
        const response = await request(app)
          .put(`/users/${userId}`)
          .send(updatedUser);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Utilisateur mis à jour avec succès');
        // Autres assertions...
      });
    

    
      // Test pour la connexion
      it('POST /login - Connexion d\'un utilisateur', async () => {
        const credentials = {
            username: 'testUser',
            password: 'password123'
        };
    
        const response = await request(app)
          .post('/login')
          .send(credentials);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Connexion réussie');
        // Autres assertions...
      });


      it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const response = await request(app).delete(`/users/${userId}`);
    
        expect(response.statusCode).toBe(204);
        // Autres assertions...
      });

  // Ajoutez des tests pour GET, PUT, DELETE, etc.
});

