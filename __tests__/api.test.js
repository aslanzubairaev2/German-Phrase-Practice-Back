const request = require('supertest');
const app = require('../api/index');

jest.mock('../supabaseClient');
const supabase = require('../supabaseClient');

// Mock Supabase methods
supabase.from = jest.fn();
supabase.auth = {
    getUser: jest.fn(),
    admin: {
        getUserById: jest.fn()
    }
};

// Mock user for authentication tests
const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockToken = 'mock-jwt-token';

describe('API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/initial-data', () => {
        it('should return initial data successfully', async () => {
            const mockCategories = [{ id: 1, name: 'Basics', color: '#ff0000', user_id: mockUser.id }];
            const mockPhrases = [{ id: 1, russian: 'привет', german: 'hallo', category_id: 1, user_id: mockUser.id }];

            supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            supabase.from
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ data: mockCategories, error: null })
                    })
                }))
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ data: mockPhrases, error: null })
                    })
                }));

            const res = await request(app)
                .get('/api/initial-data')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('categories');
            expect(res.body).toHaveProperty('phrases');
            expect(res.body.categories).toEqual(mockCategories);
            expect(res.body.phrases).toHaveLength(1);
            expect(res.body.phrases[0]).toHaveProperty('masteryLevel', 0);
        });

        it('should handle errors', async () => {
            supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
                })
            });

            const res = await request(app)
                .get('/api/initial-data')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/phrases', () => {
        it('should create a phrase successfully', async () => {
            const newPhrase = { russian: 'спасибо', german: 'danke', category_id: 1 };
            const mockResponse = { id: 1, user_id: mockUser.id, ...newPhrase };

            supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            supabase.from.mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: mockResponse, error: null })
                    })
                })
            });

            const res = await request(app)
                .post('/api/phrases')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(newPhrase);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockResponse);
        });

        it('should handle creation errors', async () => {
            supabase.from.mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Insert error' } })
                    })
                })
            });

            const res = await request(app)
                .post('/api/phrases')
                .send({ russian: 'test', german: 'test', category_id: 1 });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/phrases/:id', () => {
        it('should update a phrase successfully', async () => {
            const updatedPhrase = { id: 1, russian: 'пожалуйста', german: 'bitte', category_id: 1 };

            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: [updatedPhrase], error: null })
                    })
                })
            });

            const res = await request(app)
                .put('/api/phrases/1')
                .send({ russian: 'пожалуйста', german: 'bitte', category_id: 1 });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(updatedPhrase);
        });

        it('should handle update errors', async () => {
            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: [], error: null })
                    })
                })
            });

            const res = await request(app)
                .put('/api/phrases/1')
                .send({ russian: 'test', german: 'test', category_id: 1 });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('DELETE /api/phrases/:id', () => {
        it('should delete a phrase successfully', async () => {
            supabase.from.mockReturnValue({
                delete: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ error: null })
                })
            });

            const res = await request(app).delete('/api/phrases/1');

            expect(res.status).toBe(204);
        });

        it('should handle delete errors', async () => {
            supabase.from.mockReturnValue({
                delete: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ error: { message: 'Delete error' } })
                })
            });

            const res = await request(app).delete('/api/phrases/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/categories', () => {
        it('should create a category successfully', async () => {
            const newCategory = { name: 'Verbs', color: '#00ff00', is_foundational: false };
            const mockResponse = { id: 1, ...newCategory };

            supabase.from.mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: mockResponse, error: null })
                    })
                })
            });

            const res = await request(app)
                .post('/api/categories')
                .send(newCategory);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockResponse);
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should update a category successfully', async () => {
            const updatedCategory = { id: 1, name: 'Updated Verbs', color: '#0000ff' };

            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: [updatedCategory], error: null })
                    })
                })
            });

            const res = await request(app)
                .put('/api/categories/1')
                .send({ name: 'Updated Verbs', color: '#0000ff' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(updatedCategory);
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('should delete a category with migration successfully', async () => {
            supabase.from
                .mockImplementationOnce(() => ({
                    update: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ error: null })
                    })
                }))
                .mockImplementationOnce(() => ({
                    delete: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ error: null })
                    })
                }));

            const res = await request(app)
                .delete('/api/categories/1')
                .send({ migrationTargetId: 2 });

            expect(res.status).toBe(204);
        });

        it('should delete a category without migration successfully', async () => {
            supabase.from
                .mockImplementationOnce(() => ({
                    delete: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ error: null })
                    })
                }))
                .mockImplementationOnce(() => ({
                    delete: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue({ error: null })
                    })
                }));

            const res = await request(app)
                .delete('/api/categories/1')
                .send({});

            expect(res.status).toBe(204);
        });
    });

    describe('Authentication', () => {
        describe('Auth Middleware', () => {
            it('should reject requests without token', async () => {
                const res = await request(app).get('/api/auth/profile');
                expect(res.status).toBe(401);
                expect(res.body.error).toBe('No token provided');
            });

            it('should reject requests with invalid token', async () => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } });

                const res = await request(app)
                    .get('/api/auth/profile')
                    .set('Authorization', 'Bearer invalid-token');

                expect(res.status).toBe(401);
                expect(res.body.error).toBe('Invalid token');
            });

            it('should allow requests with valid token', async () => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

                const res = await request(app)
                    .get('/api/auth/profile')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(res.status).toBe(200);
            });
        });

        describe('GET /api/auth/profile', () => {
            it('should return user profile', async () => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
                supabase.auth.admin.getUserById.mockResolvedValue({ data: mockUser, error: null });

                const res = await request(app)
                    .get('/api/auth/profile')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('id', mockUser.id);
                expect(res.body).toHaveProperty('email', mockUser.email);
            });

            it('should handle profile fetch errors', async () => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
                supabase.auth.admin.getUserById.mockResolvedValue({ data: null, error: { message: 'User not found' } });

                const res = await request(app)
                    .get('/api/auth/profile')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(res.status).toBe(500);
                expect(res.body).toHaveProperty('error');
            });
        });

        describe('GET /api/auth/verify', () => {
            it('should verify token successfully', async () => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

                const res = await request(app)
                    .get('/api/auth/verify')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('valid', true);
                expect(res.body.user).toHaveProperty('id', mockUser.id);
            });
        });

        describe('Protected Routes', () => {
            beforeEach(() => {
                supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            });

            it('should reject POST /api/phrases without auth', async () => {
                const res = await request(app)
                    .post('/api/phrases')
                    .send({ russian: 'test', german: 'test', category_id: 1 });

                expect(res.status).toBe(401);
            });

            it('should allow POST /api/phrases with auth', async () => {
                supabase.from.mockReturnValue({
                    insert: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({
                                data: { id: 1, user_id: mockUser.id, russian: 'test', german: 'test', category_id: 1 },
                                error: null
                            })
                        })
                    })
                });

                const res = await request(app)
                    .post('/api/phrases')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send({ russian: 'test', german: 'test', category_id: 1 });

                expect(res.status).toBe(201);
            });

            it('should filter data by user_id in GET /api/initial-data', async () => {
                const userCategories = [{ id: 1, user_id: mockUser.id, name: 'User Category' }];
                const userPhrases = [{ id: 1, user_id: mockUser.id, russian: 'test', german: 'test', category_id: 1 }];

                supabase.from
                    .mockImplementationOnce(() => ({
                        select: jest.fn().mockResolvedValue({ data: userCategories, error: null })
                    }))
                    .mockImplementationOnce(() => ({
                        select: jest.fn().mockResolvedValue({ data: userPhrases, error: null })
                    }));

                const res = await request(app)
                    .get('/api/initial-data')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(res.status).toBe(200);
                expect(res.body.categories).toEqual(userCategories);
                expect(res.body.phrases).toEqual(userPhrases);
            });
        });
    });
});