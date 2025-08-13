import React, { useEffect, useState } from 'react';
import problemService from '@/services/admin/problemService';
import type { IProblem, ITestCase } from '@/types/index';
import { z } from 'zod';

const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    problemId: z.number().int().positive(),
    slug: z.string().min(1, "Slug is required"),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    categories: z.array(z.string()),
    description: z.string().min(1, "Description is required"),
    constraints: z.string().optional(),
});

type ProblemFormData = z.infer<typeof problemSchema>;

const ProblemManagement: React.FC = () => {
    const [problems, setProblems] = useState<IProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<IProblem | null>(null);
    const [form, setForm] = useState<ProblemFormData>({
        title: '',
        problemId: 0,
        slug: '',
        difficulty: 'Easy',
        categories: [],
        description: '',
        constraints: '',
    });
    const [formErrors, setFormErrors] = useState<any>({});

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const data = await problemService.getProblems();
            setProblems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch problems');
        } finally {
            setLoading(false);
        }
    };

    const handleViewProblem = (problem: IProblem) => {
        setSelectedProblem(problem);
        setShowViewModal(true);
    };

    const handleEditProblem = (problem: IProblem) => {
        setSelectedProblem(problem);
        setForm({
            title: problem.title,
            problemId: problem.problemId,
            slug: problem.slug,
            difficulty: problem.difficulty,
            categories: problem.categories,
            description: problem.description,
            constraints: problem.constraints || '',
        });
        setShowUpdateModal(true);
    };

    const handleDeleteProblem = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            try {
                await problemService.deleteProblem(id);
                fetchProblems();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete problem');
            }
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = problemSchema.safeParse(form);
        if (!result.success) {
            setFormErrors(result.error.flatten().fieldErrors);
            return;
        }
        setFormErrors({});

        try {
            if (selectedProblem) {
                await problemService.updateProblem(selectedProblem._id!, result.data);
            } else {
                await problemService.createProblem(result.data);
            }
            closeModal();
            fetchProblems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save problem');
        }
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setShowViewModal(false);
        setShowUpdateModal(false);
        setSelectedProblem(null);
        setForm({
            title: '',
            problemId: 0,
            slug: '',
            difficulty: 'Easy',
            categories: [],
            description: '',
            constraints: '',
        });
        setFormErrors({});
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Problem Management</h2>
                <button
                    onClick={() => { setSelectedProblem(null); setShowCreateModal(true); }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Problem
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Difficulty</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {problems.map((problem: IProblem) => (
                                <tr key={problem._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-white">{problem.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{problem.difficulty}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            problem.status === 'published' ? 'bg-green-100 text-green-800' :
                                            problem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {problem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleViewProblem(problem)} className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-500/10 transition-colors">View</button>
                                        <button onClick={() => handleEditProblem(problem)} className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded hover:bg-yellow-500/10 transition-colors">Edit</button>
                                        <button onClick={() => handleDeleteProblem(problem._id!)} className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(showCreateModal || showUpdateModal) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 w-full max-w-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">{selectedProblem ? 'Update' : 'Create'} Problem</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" className="w-full p-2 bg-gray-700 rounded" />
                            {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title[0]}</p>}
                            <input name="problemId" type="number" value={form.problemId} onChange={handleFormChange} placeholder="Problem ID" className="w-full p-2 bg-gray-700 rounded" />
                            {formErrors.problemId && <p className="text-red-500 text-xs">{formErrors.problemId[0]}</p>}
                            <input name="slug" value={form.slug} onChange={handleFormChange} placeholder="Slug" className="w-full p-2 bg-gray-700 rounded" />
                            {formErrors.slug && <p className="text-red-500 text-xs">{formErrors.slug[0]}</p>}
                            <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="w-full p-2 bg-gray-700 rounded">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="w-full p-2 bg-gray-700 rounded" />
                            {formErrors.description && <p className="text-red-500 text-xs">{formErrors.description[0]}</p>}
                            <textarea name="constraints" value={form.constraints} onChange={handleFormChange} placeholder="Constraints" className="w-full p-2 bg-gray-700 rounded" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-violet-600 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewModal && selectedProblem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 w-full max-w-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">{selectedProblem.title}</h3>
                        <p>{selectedProblem.description}</p>
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-600 rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemManagement;
