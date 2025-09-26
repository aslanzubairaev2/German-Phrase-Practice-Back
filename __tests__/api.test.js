const request = require('supertest');
const app = require('../api/index');

jest.mock('../supabaseClient');
const supabase = require('../supabaseClient');

describe('API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/initial-data', () => {
        it('should return initial data successfully', async () => {
            const mockCategories = [{ id: 1, name: 'Basics', color: '#ff0000' }];
            const mockPhrases = [{ id: 1, russian: 'привет', german: 'hallo', category_id: 1 }];

            supabase.from
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockResolvedValue({ data: mockCategories, error: null })
                }))
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockResolvedValue({ data: mockPhrases, error: null })
                }));

            const res = await request(app).get('/api/initial-data');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('categories');
            expect(res.body).toHaveProperty('phrases');
            expect(res.body.categories).toEqual(mockCategories);
            expect(res.body.phrases).toHaveLength(1);
            expect(res.body.phrases[0]).toHaveProperty('masteryLevel', 0);
        });

        it('should handle errors', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
            });

            const res = await request(app).get('/api/initial-data');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /api/phrases', () => {
        it('should create a phrase successfully', async () => {
            const newPhrase = { russian: 'спасибо', german: 'danke', category_id: 1 };
            const mockResponse = { id: 1, ...newPhrase };

            supabase.from.mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: mockResponse, error: null })
                    })
                })
            });

            const res = await request(app)
                .post('/api/phrases')
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
                .send({ russian: 'test', german: 'test' });

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
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({ data: updatedPhrase, error: null })
                        })
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
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Update error' } })
                        })
                    })
                })
            });

            const res = await request(app)
                .put('/api/phrases/1')
                .send({ russian: 'test' });

            expect(res.status).toBe(500);
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
            const newCategory = { id: 1, name: 'Verbs', color: '#00ff00', is_foundational: false };
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
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({ data: updatedCategory, error: null })
                        })
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
});