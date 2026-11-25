import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import { MessageSquare, ThumbsUp, CheckCircle, Plus, Send, X } from 'lucide-react';

export const ForumView: React.FC = () => {
  const { forumPosts, addForumPost, addForumReply, upvoteForumPost } = useApp();

  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Dev, Architecture');
  const [newCode, setNewCode] = useState('');

  const allTags = ['Tous', 'IA & Data', 'ONNX', 'Télécoms', 'IoT', 'LoRa', 'Embedded'];

  const filteredPosts = selectedTag === 'Tous'
    ? forumPosts
    : forumPosts.filter(p => p.tags.includes(selectedTag));

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    addForumPost({
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      codeSnippet: newCode || undefined
    });

    setIsNewPostOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewCode('');
  };

  const handleSendReply = (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;

    addForumReply(postId, text);
    setReplyInput(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Forum technique
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Entraide sur les projets du club, snippets de code et retours d’expérience.
          </p>
        </div>

        <button
          onClick={() => setIsNewPostOpen(true)}
          className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau sujet</span>
        </button>
      </div>

      {/* Tags Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedTag === tag
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={post.authorName} size="sm" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {post.authorName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 truncate">
                {post.tags.join(' · ')}
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.content}
            </p>

            {post.codeSnippet && (
              <div className="rounded-xl bg-slate-950 text-slate-200 p-3.5 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{post.codeSnippet}</pre>
              </div>
            )}

            <div className="flex items-center gap-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => upvoteForumPost(post.id)}
                className={`min-h-[36px] flex items-center gap-1.5 font-mono font-medium transition-colors ${
                  post.userUpvoted
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="tabular-nums">{post.upvotes}</span>
              </button>

              <span className="flex items-center gap-1.5 text-slate-500 font-mono tabular-nums">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.repliesCount}</span>
              </span>
            </div>

            {post.replies.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                {post.replies.map(reply => (
                  <div
                    key={reply.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      reply.isAcceptedSolution
                        ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={reply.authorName} size="sm" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {reply.authorName}
                        </span>
                      </div>
                      {reply.isAcceptedSolution && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Solution</span>
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Écrire une réponse..."
                value={replyInput[post.id] || ''}
                onChange={(e) => setReplyInput({ ...replyInput, [post.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply(post.id);
                }}
                className="flex-1 min-h-[40px] px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
              <button
                onClick={() => handleSendReply(post.id)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* New Question Modal */}
      {isNewPostOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setIsNewPostOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nouveau sujet technique
              </h3>
              <button onClick={() => setIsNewPostOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Titre *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Configurer les timers PWM sur ESP32"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Détails *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contexte, erreur observée, essais..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Extrait de code (optionnel)</label>
                <textarea
                  rows={3}
                  placeholder="// Code ou configuration"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg font-mono border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tags</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewPostOpen(false)} className="min-h-[40px] px-4 py-2 text-slate-600 dark:text-slate-400">
                  Annuler
                </button>
                <button type="submit" className="min-h-[40px] px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
