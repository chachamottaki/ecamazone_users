const request = require('supertest');
const app = require('../server.js'); // Mettez à jour le chemin
const db = require('../models/index');
const { sequelize } = db;
const bcrypt = require('bcrypt');
let server;


const User = db.User;

describe('API /users', () => {
    let testUserId;


  
    beforeAll(() => {
      server = app.listen(4000); // Démarrer le serveur sur un port spécifique pour les tests
    });
  
    afterAll(() => {
      server.close(); // Fermer le serveur après les tests
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
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      shippingAddress: '123 Test Street, Test City',

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
          // ...autres champs à mettre à jour
        };
    
        const response = await request(app)
          .put(`/users/${userId}`)
          .send(updatedUser);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Utilisateur mis à jour avec succès');
        // Autres assertions...
      });
    
      it('POST /login - Connexion d\'un utilisateur', async () => {
        // Créer un utilisateur spécifique pour ce test
        const hashedPassword = await bcrypt.hash('loginPassword123', 10);

        const testUser = {
          username: 'loginTestUser',
          fullName: 'Login Test User',
          email: 'login_test@example.com',
          phoneNumber: '1234567890',
          shippingAddress: '123 Login Street, Test City',
          password: hashedPassword
        };
      
        const createdUser = await User.create(testUser);
        createdUserId = createdUser.id; // Sauvegarder l'ID pour la suppression
      
        // Test de la connexion
        const credentials = {
          username: 'loginTestUser',
          password: 'loginPassword123'
        };
      
        const response = await request(app)
          .post('/login')
          .send(credentials);
      
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Connexion réussie');
      
        // Supprimer l'utilisateur créé pour ce test
        if (createdUserId) {
          await User.destroy({ where: { id: createdUserId } });
        }
      });

    
      // Test pour la connexion
      // it('POST /login - Connexion d\'un utilisateur', async () => {

      //   const credentials = {
      //       username: 'anouar',
      //       password: 'anouar'
      //   };
    
      //   const response = await request(app)
      //     .post('/login')
      //     .send(credentials);
    
      //   expect(response.statusCode).toBe(200);
      //   expect(response.body.message).toBe('Connexion réussie');
      //   // Autres assertions...
      // });


      it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
        const newUser = {
          username: 'testUser',
          fullName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890',
          shippingAddress: '123 Test Street, Test City',
          password: 'password123'
        };
    
        const createdUser = await User.create(newUser);
        testUserId = createdUser.id;
        const userId = testUserId; // Assurez-vous que cet utilisateur existe
        const response = await request(app).delete(`/users/${userId}`);
    
        expect(response.statusCode).toBe(204);
        // Autres assertions...
      });
      it('POST /change-password/:userId - Changement de mot de passe d\'un utilisateur', async () => {
        // Créer un utilisateur pour le test
        const hashedPassword = await bcrypt.hash('oldPassword123', 10);
        const testUser = {
            username: 'changePassUser',
            fullName: 'Change Pass User',
            email: 'change_pass@example.com',
            phoneNumber: '1234567890',
            shippingAddress: '123 Change Pass Street',
            password: hashedPassword
        };
    
        const createdUser = await User.create(testUser);
        testUserId = createdUser.id;
    
        // Données pour le changement de mot de passe
        const passwordData = {
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123'
        };
    
        // Envoi de la requête de changement de mot de passe
        const response = await request(app)
          .post(`/change-password/${testUserId}`)
          .send(passwordData);
    
        expect(response.statusCode).toBe(200); // Assurez-vous que cela correspond à votre implémentation
        expect(response.body.message).toBe('Mot de passe mis à jour avec succès');
    
        // Nettoyage: Supprimer l'utilisateur de test
        await User.destroy({ where: { id: testUserId } });
    });
    

  // Ajoutez des tests pour GET, PUT, DELETE, etc.
});

