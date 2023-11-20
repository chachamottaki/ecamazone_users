const request = require('supertest');
const app = require('../server.js'); // Mettez à jour le chemin
const db = require('../models/index');
const { sequelize } = db;

const User = db.User;

describe('API /users', () => {
    let testUserId;
    



    afterEach(async () => {
        // Supprimer l'utilisateur de test
        if (testUserId) {
          await User.destroy({ where: { id: testUserId } });
        }
      });

  it('POST /users - Créer un utilisateur', async () => {
    const newUser = {
      username: 'testUser',
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      shippingAddress: '123 Test Street, Test City',
      billingAddress: '456 Billing Street, Billing City',
      cardHolderName: 'Test User',
      cardLastFourDigits: '1234',
      cardExpirationDate: '12/23',
      cardType: 'Visa',
      password: 'password123'
    };


    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    testUserId = response.body.id;

    // Autres assertions...
  });

    // Test pour récupérer un utilisateur par ID
    it('GET /users/:userId - Récupérer un utilisateur', async () => {
      const newUser = {
        username: 'testUser',
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        shippingAddress: '123 Test Street, Test City',
        billingAddress: '456 Billing Street, Billing City',
        cardHolderName: 'Test User',
        cardLastFourDigits: '1234',
        cardExpirationDate: '12/23',
        cardType: 'Visa',
        password: 'password123'
      };
  
      const createdUser = await User.create(newUser);
      testUserId = createdUser.id;

        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const response = await request(app).get(`/users/${userId}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
        // Autres assertions...
      });
    
      it('PUT /users/:userId - Mettre à jour un utilisateur', async () => {
        const newUser = {
          username: 'testUser',
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890',
          shippingAddress: '123 Test Street, Test City',
          billingAddress: '456 Billing Street, Billing City',
          cardHolderName: 'Test User',
          cardLastFourDigits: '1234',
          cardExpirationDate: '12/23',
          cardType: 'Visa',
          password: 'password123'
        };
    
        const createdUser = await User.create(newUser);
        testUserId = createdUser.id;
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const updatedUser = {
          username: 'Updated testUser',
          fullName: 'Updated Test User',
          email: 'Updatedtest@example.com',
          phoneNumber: '0987654321',
          shippingAddress: 'Updated 123 Test Street',
          billingAddress: 'Updated 456 Billing Street',
          cardHolderName: 'Updated Test User',
          cardLastFourDigits: '4321',
          cardExpirationDate: '01/25',
          cardType: 'MasterCard'
          // ...autres champs à mettre à jour
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
            username: 'anouar',
            password: 'anouar'
        };
    
        const response = await request(app)
          .post('/login')
          .send(credentials);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Connexion réussie');
        // Autres assertions...
      });


      it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
        const newUser = {
          username: 'testUser',
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890',
          shippingAddress: '123 Test Street, Test City',
          billingAddress: '456 Billing Street, Billing City',
          cardHolderName: 'Test User',
          cardLastFourDigits: '1234',
          cardExpirationDate: '12/23',
          cardType: 'Visa',
          password: 'password123'
        };
    
        const createdUser = await User.create(newUser);
        testUserId = createdUser.id;
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const response = await request(app).delete(`/users/${userId}`);
    
        expect(response.statusCode).toBe(204);
        // Autres assertions...
      });

  // Ajoutez des tests pour GET, PUT, DELETE, etc.
});

