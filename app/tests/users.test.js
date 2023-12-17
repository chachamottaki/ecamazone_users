const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../models/index');
const app = require('../server.js');

const User = db.User;
const Address = db.Address;

describe('API /users', () => {
    // Test pour créer un utilisateur
    it('Créer un utilisateur', async () => {
        const newUser = {
            username: 'newUser',
            fullName: 'New User',
            email: 'newuser@example.com',
            phoneNumber: '1234567890',
            password: 'newPassword123'
        };

        const response = await request(app).post('/users').send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('username', 'newUser');

        await User.destroy({ where: { id: response.body.id } });
    });

    // Test pour récupérer un utilisateur par ID
    it('Récupérer un utilisateur par ID', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'testuser',
            fullName: 'Test User',
            email: 'testuser@example.com',
            phoneNumber: '1234567890',
            password: hashedPassword
        });

        const response = await request(app).get(`/users/${user.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', user.id);

        await User.destroy({ where: { id: user.id } });
    });

    // Test pour mettre à jour un utilisateur
    it('Mettre à jour un utilisateur', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'updateUser',
            fullName: 'Update User',
            email: 'updateuser@example.com',
            phoneNumber: '0987654321',
            password: hashedPassword
        });

        const updatedUser = {
            username: 'updatedUser',
            fullName: 'Updated User',
            email: 'updateduser@example.com',
            phoneNumber: '9876543210'
        };

        const response = await request(app).put(`/users/${user.id}`).send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Utilisateur mis à jour avec succès');

        await User.destroy({ where: { id: user.id } });
    });

    // Test pour supprimer un utilisateur
    it('Supprimer un utilisateur', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'deleteUser',
            fullName: 'Delete User',
            email: 'deleteuser@example.com',
            phoneNumber: '0987654321',
            password: hashedPassword
        });

        const response = await request(app).delete(`/users/${user.id}`);
        expect(response.statusCode).toBe(204);
    });

    // Test pour la connexion d'un utilisateur
    it('Connexion d\'un utilisateur', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            username: 'loginUser',
            fullName: 'Login User',
            email: 'loginuser@example.com',
            phoneNumber: '0987654321',
            password: hashedPassword
        });

        const credentials = { username: 'loginUser', password: 'password123' };
        const response = await request(app).post('/login').send(credentials);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Connexion réussie');

        await User.destroy({ where: { id: user.id } });
    });

    // Test pour changer le mot de passe d'un utilisateur
    it('Changer le mot de passe d\'un utilisateur', async () => {
        const hashedPassword = await bcrypt.hash('oldPassword123', 10);
        const user = await User.create({
            username: 'changePassUser',
            fullName: 'Change Pass User',
            email: 'changepassuser@example.com',
            phoneNumber: '0987654321',
            password: hashedPassword
        });

        const passwordData = {
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123'
        };

        const response = await request(app).post(`/change-password/${user.id}`).send(passwordData);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Mot de passe mis à jour avec succès');

        await User.destroy({ where: { id: user.id } });
    });

    // Test pour ajouter une adresse à un utilisateur
    it('Ajouter une adresse à un utilisateur', async () => {
        const user = await User.create({
            username: 'addressUser',
            fullName: 'Address User',
            email: 'addressuser@example.com',
            phoneNumber: '0987654321',
            password: await bcrypt.hash('password123', 10)
        });

        const newAddress = {
            street: '456 New Street',
            city: 'New City',
            zipCode: '54321',
            country: 'Newland'
        };

        const response = await request(app).post(`/users/${user.id}/addresses`).send(newAddress);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('street', '456 New Street');

        await Address.destroy({ where: { id: response.body.id } });
        await User.destroy({ where: { id: user.id } });
    });

    // Test pour mettre à jour une adresse
    it('Mettre à jour une adresse', async () => {
        const user = await User.create({
            username: 'updateAddressUser',
            fullName: 'Update Address User',
            email: 'updateaddressuser@example.com',
            phoneNumber: '0987654321',
            password: await bcrypt.hash('password123', 10)
        });

        const address = await Address.create({
            street: '789 Original Street',
            city: 'Original City',
            zipCode: '67890',
            country: 'Originaland',
            UserId: user.id
        });

        const updatedAddress = {
            street: '789 Updated Street',
            city: 'Updated City',
            zipCode: '98765',
            country: 'Updatedland'
        };

        const response = await request(app).put(`/addresses/${address.id}`).send(updatedAddress);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('street', '789 Updated Street');

        await Address.destroy({ where: { id: address.id } });
        await User.destroy({ where: { id: user.id } });
    });

    // Test pour supprimer une adresse
    it('Supprimer une adresse', async () => {
        const user = await User.create({
            username: 'deleteAddressUser',
            fullName: 'Delete Address User',
            email: 'deleteaddressuser@example.com',
            phoneNumber: '0987654321',
            password: await bcrypt.hash('password123', 10)
        });

        const address = await Address.create({
            street: '123 Delete Street',
            city: 'Delete City',
            zipCode: '12345',
            country: 'Delete Country',
            UserId: user.id
        });

        const response = await request(app).delete(`/addresses/${address.id}`);
        expect(response.statusCode).toBe(204);

        await User.destroy({ where: { id: user.id } });
    });

    // Test pour récupérer les adresses d'un utilisateur
    it('Récupérer les adresses d\'un utilisateur', async () => {
        const user = await User.create({
            username: 'getUserAddresses',
            fullName: 'Get User Addresses',
            email: 'getuseraddresses@example.com',
            phoneNumber: '0987654321',
            password: await bcrypt.hash('password123', 10)
        });

        await Address.create({
            street: '123 Test Street',
            city: 'Test City',
            zipCode: '12345',
            country: 'Test Country',
            UserId: user.id
        });

        const response = await request(app).get(`/users/${user.id}/addresses`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ street: '123 Test Street' })
        ]));

        await Address.destroy({ where: { UserId: user.id } });
        await User.destroy({ where: { id: user.id } });
    });
});


// const request = require('supertest');
// const bcrypt = require('bcrypt');
// const db = require('../models/index'); // Mettez à jour le chemin si nécessaire
// const app = require('../server.js'); // Mettez à jour le chemin si nécessaire

// const User = db.User;
// const Address = db.Address;

// describe('API /users', () => {
//     let server, testUserId, testAddressId;

//     beforeAll(() => {
//         server = app.listen(4000); // Utilisez un port différent pour les tests
//     });

//     afterAll(() => {
//         server.close();
//     });

//     beforeEach(async () => {
//         // Création d'un utilisateur de test
//         const hashedPassword = await bcrypt.hash('password123', 10);
//         const user = await User.create({
//             username: 'testuser',
//             fullName: 'Test User',
//             email: 'testuser@example.com',
//             phoneNumber: '1234567890',
//             password: hashedPassword
//         });
//         testUserId = user.id;

//         // Création d'une adresse de test
//         const address = await Address.create({
//             street: '123 Test Street',
//             city: 'Test City',
//             zipCode: '12345',
//             country: 'Testland',
//             UserId: testUserId
//         });
//         testAddressId = address.id;
//     });

//     afterEach(async () => {
//         await Address.destroy({ where: { UserId: testUserId } });
//         await User.destroy({ where: { id: testUserId } });
//     });

//     // it('GET /users/:userId/addresses - Récupérer les adresses d\'un utilisateur', async () => {
//     //     const response = await request(app).get(`/users/${testUserId}/addresses`);
//     //     expect(response.statusCode).toBe(200);
//     //     expect(response.body).toEqual(expect.arrayContaining([
//     //         expect.objectContaining({ street: '123 Test Street' })
//     //     ]));
//     // });

//     it('POST /users/:userId/addresses - Ajouter une adresse à un utilisateur', async () => {
//         const newAddress = {
//             street: '456 New Street',
//             city: 'New City',
//             zipCode: '54321',
//             country: 'Newland'
//         };

//         const response = await request(app)
//             .post(`/users/${testUserId}/addresses`)
//             .send(newAddress);

//         expect(response.statusCode).toBe(201);
//         expect(response.body).toHaveProperty('street', '456 New Street');
//     });

//     it('PUT /addresses/:addressId - Mettre à jour une adresse', async () => {
//         const updatedAddress = {
//             street: '789 Updated Street',
//             city: 'Updated City',
//             zipCode: '67890',
//             country: 'Updatedland'
//         };

//         const response = await request(app)
//             .put(`/addresses/${testAddressId}`)
//             .send(updatedAddress);

//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveProperty('street', '789 Updated Street');
//     });

//     it('DELETE /addresses/:addressId - Supprimer une adresse', async () => {
//         const response = await request(app).delete(`/addresses/${testAddressId}`);
//         expect(response.statusCode).toBe(204);
//     });
//     // ...

// // Test pour la création d'un utilisateur
// it('POST /users - Créer un utilisateur', async () => {
//   const newUser = {
//       username: 'newUser',
//       fullName: 'New User',
//       email: 'newuser@example.com',
//       phoneNumber: '1234567890',
//       password: 'newPassword123'
//   };

//   const response = await request(app)
//       .post('/users')
//       .send(newUser);

//   expect(response.statusCode).toBe(201);
//   expect(response.body).toHaveProperty('username', 'newUser');

//   // Nettoyage: Supprimer l'utilisateur créé pour ce test
//   const createdUserId = response.body.id;
//   await User.destroy({ where: { id: createdUserId } });
// });

// // Test pour la connexion d'un utilisateur
// it('POST /login - Connexion d\'un utilisateur', async () => {
//   const credentials = {
//       username: 'testuser', // Utiliser le nom d'utilisateur de l'utilisateur de test
//       password: 'password123'
//   };

//   const response = await request(app)
//       .post('/login')
//       .send(credentials);

//   expect(response.statusCode).toBe(200);
//   expect(response.body).toHaveProperty('message', 'Connexion réussie');
// });

// // Test pour le changement de mot de passe
// it('POST /change-password/:userId - Changement de mot de passe d\'un utilisateur', async () => {
//   const passwordData = {
//       oldPassword: 'password123',
//       newPassword: 'newPassword123'
//   };

//   const response = await request(app)
//       .post(`/change-password/${testUserId}`)
//       .send(passwordData);

//   expect(response.statusCode).toBe(200);
//   expect(response.body).toHaveProperty('message', 'Mot de passe mis à jour avec succès');
// });

// // Test pour la suppression d'un utilisateur
// it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
//   const response = await request(app).delete(`/users/${testUserId}`);
//   expect(response.statusCode).toBe(204);
// });
// it('GET /users/:userId - Récupérer les détails d\'un utilisateur', async () => {
//   const response = await request(app).get(`/users/${testUserId}`);
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toHaveProperty('id', testUserId);
//   expect(response.body).toHaveProperty('username', 'testuser');
//   // Ajoutez d'autres assertions pour les champs que vous attendez
// });
// it('PUT /users/:userId - Mettre à jour les informations d\'un utilisateur', async () => {
//   const updatedUser = {
//       username: 'Updated testUser',
//       fullName: 'Updated Test User',
//       email: 'updated@example.com',
//       phoneNumber: '9876543210',
//       // Ajoutez d'autres champs que vous souhaitez tester
//   };

//   const response = await request(app)
//       .put(`/users/${testUserId}`)
//       .send(updatedUser);

//   expect(response.statusCode).toBe(200);
//   expect(response.body.message).toBe('Utilisateur mis à jour avec succès');
//   // Autres assertions pour vérifier la mise à jour
// });


// // ...


// });

// // const request = require('supertest');
// // const app = require('../server.js'); // Mettez à jour le chemin
// // const db = require('../models/index');
// // const { sequelize } = db;
// // const bcrypt = require('bcrypt');
// // let server;


// // const User = db.User;

// // describe('API /users', () => {
// //     let testUserId;


  
// //     beforeAll(() => {
// //       server = app.listen(4000); // Démarrer le serveur sur un port spécifique pour les tests
// //     });
  
// //     afterAll(() => {
// //       server.close(); // Fermer le serveur après les tests
// //     });
    



// //     afterEach(async () => {
// //         // Supprimer l'utilisateur de test
// //         if (testUserId) {
// //           await User.destroy({ where: { id: testUserId } });
// //         }
// //       });

// //   it('POST /users - Créer un utilisateur', async () => {
// //     const newUser = {
// //       username: 'testUser',
// //       fullName: 'Test User',
// //       email: 'test@example.com',
// //       phoneNumber: '1234567890',
// //       // shippingAddress: '123 Test Street, Test City',

// //       password: 'password123'
// //     };


// //     const response = await request(app)
// //       .post('/users')
// //       .send(newUser);

// //     expect(response.statusCode).toBe(201);
// //     testUserId = response.body.id;

// //     // Autres assertions...
// //   });

// //     // Test pour récupérer un utilisateur par ID
// //     it('GET /users/:userId - Récupérer un utilisateur', async () => {
// //       const newUser = {
// //         username: 'testUser',
// //         fullName: 'Test User',
// //         email: 'test@example.com',
// //         phoneNumber: '1234567890',
// //         // shippingAddress: '123 Test Street, Test City',
// //         password: 'password123'
// //       };
  
// //       const createdUser = await User.create(newUser);
// //       testUserId = createdUser.id;

// //         const userId = testUserId; // Assurez-vous que cet utilisateur existe
// //         const response = await request(app).get(`/users/${userId}`);
    
// //         expect(response.statusCode).toBe(200);
// //         expect(response.body).toHaveProperty('id', userId);
// //         // Autres assertions...
// //       });
    
// //       it('PUT /users/:userId - Mettre à jour un utilisateur', async () => {
// //         const newUser = {
// //           username: 'testUser',
// //           fullName: 'Test User',
// //           email: 'test@example.com',
// //           phoneNumber: '1234567890',
// //           // shippingAddress: '123 Test Street, Test City',
// //           password: 'password123'
// //         };
    
// //         const createdUser = await User.create(newUser);
// //         testUserId = createdUser.id;
// //         const userId = testUserId; // Assurez-vous que cet utilisateur existe
// //         const updatedUser = {
// //           username: 'Updated testUser',
// //           fullName: 'Updated Test User',
// //           email: 'Updatedtest@example.com',
// //           phoneNumber: '0987654321',
// //           // shippingAddress: 'Updated 123 Test Street',
// //           // ...autres champs à mettre à jour
// //         };
    
// //         const response = await request(app)
// //           .put(`/users/${userId}`)
// //           .send(updatedUser);
    
// //         expect(response.statusCode).toBe(200);
// //         expect(response.body.message).toBe('Utilisateur mis à jour avec succès');
// //         // Autres assertions...
// //       });
    
// //       it('POST /login - Connexion d\'un utilisateur', async () => {
// //         // Créer un utilisateur spécifique pour ce test
// //         const hashedPassword = await bcrypt.hash('loginPassword123', 10);

// //         const testUser = {
// //           username: 'loginTestUser',
// //           fullName: 'Login Test User',
// //           email: 'login_test@example.com',
// //           phoneNumber: '1234567890',
// //           // shippingAddress: '123 Login Street, Test City',
// //           password: hashedPassword
// //         };
      
// //         const createdUser = await User.create(testUser);
// //         createdUserId = createdUser.id; // Sauvegarder l'ID pour la suppression
      
// //         // Test de la connexion
// //         const credentials = {
// //           username: 'loginTestUser',
// //           password: 'loginPassword123'
// //         };
      
// //         const response = await request(app)
// //           .post('/login')
// //           .send(credentials);
      
// //         expect(response.statusCode).toBe(200);
// //         expect(response.body.message).toBe('Connexion réussie');
      
// //         // Supprimer l'utilisateur créé pour ce test
// //         if (createdUserId) {
// //           await User.destroy({ where: { id: createdUserId } });
// //         }
// //       });

    
// //       // Test pour la connexion
// //       // it('POST /login - Connexion d\'un utilisateur', async () => {

// //       //   const credentials = {
// //       //       username: 'anouar',
// //       //       password: 'anouar'
// //       //   };
    
// //       //   const response = await request(app)
// //       //     .post('/login')
// //       //     .send(credentials);
    
// //       //   expect(response.statusCode).toBe(200);
// //       //   expect(response.body.message).toBe('Connexion réussie');
// //       //   // Autres assertions...
// //       // });


// //       it('DELETE /users/:userId - Supprimer un utilisateur', async () => {
// //         const newUser = {
// //           username: 'testUser',
// //           fullName: 'Test User',
// //           email: 'test@example.com',
// //           phoneNumber: '1234567890',
// //           // shippingAddress: '123 Test Street, Test City',
// //           password: 'password123'
// //         };
    
// //         const createdUser = await User.create(newUser);
// //         testUserId = createdUser.id;
// //         const userId = testUserId; // Assurez-vous que cet utilisateur existe
// //         const response = await request(app).delete(`/users/${userId}`);
    
// //         expect(response.statusCode).toBe(204);
// //         // Autres assertions...
// //       });
// //       it('POST /change-password/:userId - Changement de mot de passe d\'un utilisateur', async () => {
// //         // Créer un utilisateur pour le test
// //         const hashedPassword = await bcrypt.hash('oldPassword123', 10);
// //         const testUser = {
// //             username: 'changePassUser',
// //             fullName: 'Change Pass User',
// //             email: 'change_pass@example.com',
// //             phoneNumber: '1234567890',
// //             // shippingAddress: '123 Change Pass Street',
// //             password: hashedPassword
// //         };
    
// //         const createdUser = await User.create(testUser);
// //         testUserId = createdUser.id;
    
// //         // Données pour le changement de mot de passe
// //         const passwordData = {
// //             oldPassword: 'oldPassword123',
// //             newPassword: 'newPassword123'
// //         };
    
// //         // Envoi de la requête de changement de mot de passe
// //         const response = await request(app)
// //           .post(`/change-password/${testUserId}`)
// //           .send(passwordData);
    
// //         expect(response.statusCode).toBe(200); // Assurez-vous que cela correspond à votre implémentation
// //         expect(response.body.message).toBe('Mot de passe mis à jour avec succès');
    
// //         // Nettoyage: Supprimer l'utilisateur de test
// //         await User.destroy({ where: { id: testUserId } });
// //     });
    
// //     it('GET /users/:userId/addresses - Récupérer les adresses d\'un utilisateur', async () => {
// //       // Créer un utilisateur pour le test
// //       const testUser = {
// //         username: 'addressUser',
// //         fullName: 'Address User',
// //         email: 'address_user@example.com',
// //         phoneNumber: '1234567890',
// //         password: 'password123'
// //       };
    
// //       const createdUser = await User.create(testUser);
// //       testUserId = createdUser.id;
    
// //       // Ajouter une adresse pour le test
// //       await Address.create({
// //         street: '123 Test Street',
// //         city: 'Test City',
// //         zipCode: '12345',
// //         country: 'Test Country',
// //         UserId: testUserId
// //       });
    
// //       const response = await request(app).get(`/users/${testUserId}/addresses`);
// //       expect(response.statusCode).toBe(200);
// //       expect(response.body).toEqual(
// //         expect.arrayContaining([
// //           expect.objectContaining({
// //             street: '123 Test Street',
// //             city: 'Test City',
// //             country: 'Test Country',
// //             UserId: testUserId
// //             // ... autres champs
// //           })
// //         ])
// //       );
    
// //       // Nettoyage
// //       await User.destroy({ where: { id: testUserId } });
      
// //     });
// //     it('POST /users/:userId/addresses - Ajouter une adresse à un utilisateur', async () => {
// //       const newAddress = {
// //         street: '123 New Street',
// //         city: 'New City',
// //         zipCode: '54321',
// //         country: 'New Country'
// //       };
    
// //       const response = await request(app)
// //         .post(`/users/${testUserId}/addresses`)
// //         .send(newAddress);
    
// //       expect(response.statusCode).toBe(201);
// //       expect(response.body).toHaveProperty('street', '123 New Street');
// //       // Autres assertions...
    
// //       // Nettoyage
// //       const createdAddressId = response.body.id;
// //       await Address.destroy({ where: { id: createdAddressId } });
// //     });
// //     it('PUT /addresses/:addressId - Mettre à jour une adresse', async () => {
// //       // Supposons que vous avez une adresse existante avec un `id` spécifique
// //       const updatedAddress = {
// //         street: '456 Updated Street',
// //         city: 'Updated City',
// //         zipCode: '67890',
// //         country: 'Updated Country'
// //       };
    
// //       const response = await request(app)
// //         .put(`/addresses/${existingAddressId}`) // Remplacez par l'ID de l'adresse existante
// //         .send(updatedAddress);
    
// //       expect(response.statusCode).toBe(200);
// //       expect(response.body).toHaveProperty('street', '456 Updated Street');
// //       // Autres assertions...
// //     });
// //     it('DELETE /addresses/:addressId - Supprimer une adresse', async () => {
// //       // Supposons que vous avez une adresse existante avec un `id` spécifique
// //       const response = await request(app).delete(`/addresses/${existingAddressId}`);
    
// //       expect(response.statusCode).toBe(204);
// //       // Autres assertions...
// //     });
                

// //   // Ajoutez des tests pour GET, PUT, DELETE, etc.
// // });

