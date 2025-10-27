// src/components/assessments/CreateAssessmentModal.tsx
import React, { useState } from 'react';
import { Assessment, Question } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateAssessmentModalProps {
  onSubmit: (assessment: Omit<Assessment, 'id' | 'created_at'>) => void;
  onClose: () => void;
}

export const CreateAssessmentModal: React.FC<CreateAssessmentModalProps> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', question: '', type: 'text', options: [] }
  ]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      options: []
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      questions,
      client_id: '' // Will be set when assigned to a client
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Assessment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Questions</label>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center text-teal-600 hover:text-teal-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your question"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    />

                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { 
                        type: e.target.value as Question['type'],
                        options: e.target.value === 'multiple_choice' ? [''] : []
                      })}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="text">Text Answer</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="scale">Scale (1-10)</option>
                    </select>

                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options!];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(question.id, { options: newOptions });
                              }}
                              className="block flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = question.options!.filter((_, i) => i !== optionIndex);
                                updateQuestion(question.id, { options: newOptions });
                              }}
                              className="text-red-600 hover:text-red-700 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = [...question.options!, ''];
                            updateQuestion(question.id, { options: newOptions });
                          }}
                          className="text-teal-600 hover:text-teal-700 text-sm"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};