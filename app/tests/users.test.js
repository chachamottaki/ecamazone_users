const request = require('supertest');
const app = require('../server.js'); // Mettez à jour le chemin
const db = require('../models/index');
const User = db.User;

describe('API /users', () => {
    let testUserId;

    beforeEach(async () => {
      // Créer un utilisateur de test
      const newUser = {
        username: 'testUser',
        email: 'test@example.com',
        address: '123 Test Street',
        paymentMethod: 'card',
        password: 'password123' // Assurez-vous que le mot de passe est correctement haché si nécessaire
      };
  
      const createdUser = await User.create(newUser);
      testUserId = createdUser.id;
    });

    afterEach(async () => {
        // Supprimer l'utilisateur de test
        if (testUserId) {
          await User.destroy({ where: { id: testUserId } });
        }
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

