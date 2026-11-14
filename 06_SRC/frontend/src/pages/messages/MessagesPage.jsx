import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  ArrowLeftRight,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  Search,
  Package,
  Sparkles,
  Info
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { PublicProfileModal } from '../../components/profile/PublicProfileModal';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { CATEGORY_PRICE_LIMITS, MIN_RENTAL_PRICE } from '../../utils/constants';
import { calculateRentalPricing, validateRentalPrice } from '../../utils/validators';

export const MessagesPage = () => {
  usePageTitle('Direct Messages & Negotiation');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const targetItemId = searchParams.get('itemId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Offer modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTab, setOfferTab] = useState('rental'); // 'rental' or 'trade'
  const [offerData, setOfferData] = useState({
    dailyPrice: 15,
    days: 3,
    note: '',
    offeredItem: '',
    tradeType: 'permanent'
  });
  const [offerError, setOfferError] = useState(null);

  // Profile modal state
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const list = await messageService.getConversations();
      setConversations(list);

      // Handle targeted conversation initialization
      if (targetUserId) {
        const conv = await messageService.getOrCreateConversation({
          otherUserId: targetUserId,
          itemId: targetItemId || null
        });
        setActiveConversation(conv);
        // Refresh list
        const updatedList = await messageService.getConversations();
        setConversations(updatedList);
      } else if (list.length > 0 && !activeConversation) {
        setActiveConversation(list[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [targetUserId, targetItemId]);

  useEffect(() => {
    if (!activeConversation) return;

    let isMounted = true;
    const fetchMsgs = async () => {
      try {
        const msgs = await messageService.getMessages(activeConversation.id);
        if (isMounted) {
          setMessages(msgs);
          setTimeout(scrollToBottom, 50);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeConversation?.id]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeConversation || sending) return;

    setSending(true);
    try {
      const text = inputText.trim();
      setInputText('');
      const sent = await messageService.sendMessage({
        conversationId: activeConversation.id,
        text,
        type: 'text'
      });
      setMessages((prev) => [...prev, sent]);
      scrollToBottom();
      // Update snippet in conversations list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, last_message: text, last_message_at: sent.created_at }
            : c
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    setOfferError(null);

    if (!activeConversation) return;

    if (offerTab === 'rental') {
      const category = activeConversation.item?.category || 'General';
      const validation = validateRentalPrice(offerData.dailyPrice, category);
      if (!validation.valid) {
        setOfferError(validation.error);
        return;
      }

      const pricing = calculateRentalPricing(offerData.dailyPrice, offerData.days);
      const payload = {
        offer_type: 'rental_rate',
        daily_price: pricing.dailyPrice,
        days: pricing.days,
        total_amount: pricing.totalPayable,
        commission: pricing.commissionAmount,
        owner_share: pricing.ownerShare,
        note: offerData.note.trim()
      };

      try {
        const sent = await messageService.sendMessage({
          conversationId: activeConversation.id,
          text: `Proposed custom rental rate: INR ${pricing.dailyPrice}/day for ${pricing.days} days (Total: INR ${pricing.totalPayable}).`,
          type: 'offer',
          payload
        });
        setMessages((prev) => [...prev, sent]);
        setIsOfferModalOpen(false);
        scrollToBottom();
      } catch (err) {
        setOfferError(err.message || 'Failed to send rental offer.');
      }
    } else {
      // Trade Tab
      if (!offerData.offeredItem.trim()) {
        setOfferError('Please specify the item you are proposing to trade or exchange.');
        return;
      }

      const payload = {
        offer_type: 'trade',
        offered_item: offerData.offeredItem.trim(),
        trade_type: offerData.tradeType,
        note: offerData.note.trim()
      };

      try {
        const sent = await messageService.sendMessage({
          conversationId: activeConversation.id,
          text: `Proposed item trade: Offering "${offerData.offeredItem.trim()}" in exchange.`,
          type: 'trade',
          payload
        });
        setMessages((prev) => [...prev, sent]);
        setIsOfferModalOpen(false);
        scrollToBottom();
      } catch (err) {
        setOfferError(err.message || 'Failed to send trade proposal.');
      }
    }
  };

  const handleRespondOffer = async (messageId, action) => {
    try {
      await messageService.respondToOffer({ messageId, action });
      // Refresh messages
      const updated = await messageService.getMessages(activeConversation.id);
      setMessages(updated);
      scrollToBottom();
    } catch (err) {
      alert(err.message || `Failed to ${action} offer.`);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = c.otherUser?.full_name?.toLowerCase().includes(q);
    const itemMatch = c.item?.title?.toLowerCase().includes(q);
    const msgMatch = c.last_message?.toLowerCase().includes(q);
    return nameMatch || itemMatch || msgMatch;
  });

  return (
    <PageContainer>
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">
          Campus Messages &amp; Negotiation
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Chat with campus peers, negotiate custom rental rates, or propose barter trades directly.
        </p>
      </div>

      <div className="bg-surface-card rounded-2xl border border-surface-border shadow-xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-14rem)] min-h-[500px]">
        {/* Left Pane: Conversations List */}
        <div
          className={`w-full md:w-80 border-r border-surface-border flex flex-col bg-surface-card shrink-0 ${
            activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-surface-border">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-ink-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-surface-border bg-surface-base text-ink-primary text-xs outline-none focus:border-brand-600"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-border">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-ink-muted">
                <MessageSquare size={24} className="mx-auto mb-2 text-ink-muted/60" />
                <p className="font-semibold text-ink-primary">No conversations found</p>
                <p className="text-[11px] mt-1">
                  Start a chat by clicking "Message Owner" on any campus listing!
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <img
                      src={conv.otherUser?.avatar_url || '/default_avatar_male.svg'}
                      alt={conv.otherUser?.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-600/30 shrink-0 mt-0.5"
                      onError={(e) => {
                        e.currentTarget.src = '/default_avatar_male.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-ink-primary truncate">
                          {conv.otherUser?.full_name || 'Verified Student'}
                        </span>
                        {conv.unread > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </div>

                      {conv.item && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold truncate mb-0.5">
                          <Package size={10} className="shrink-0" />
                          <span className="truncate">{conv.item.title}</span>
                        </div>
                      )}

                      <p className="text-xs text-ink-muted truncate leading-snug">
                        {conv.last_message || 'Start typing a message...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat View */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-surface-base overflow-hidden">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-surface-card border-b border-surface-border flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100"
                  aria-label="Back to conversations list"
                >
                  <ArrowLeft size={18} />
                </button>

                <img
                  src={activeConversation.otherUser?.avatar_url || '/default_avatar_male.svg'}
                  alt={activeConversation.otherUser?.full_name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-600/30 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/default_avatar_male.svg';
                  }}
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink-primary truncate">
                      {activeConversation.otherUser?.full_name}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                      Verified Student
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProfileUserId(activeConversation.otherUser?.id)}
                    className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Student Profile &amp; Campus Pass</span>
                  </button>
                </div>
              </div>

              {/* In-Chat Negotiation Trigger Button */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOfferData({
                      dailyPrice: activeConversation.item?.daily_price || 15,
                      days: 3,
                      note: '',
                      offeredItem: '',
                      tradeType: 'permanent'
                    });
                    setIsOfferModalOpen(true);
                  }}
                  className="gap-1.5 border-[#D4A853]/60 bg-[#D4A853]/10 hover:bg-[#D4A853]/20 text-[#0F382A] dark:text-[#D4A853] font-semibold text-xs"
                >
                  <ArrowLeftRight size={13} />
                  <span>Propose Offer / Trade</span>
                </Button>
              </div>
            </div>

            {/* Linked Item Banner if discussing an item */}
            {activeConversation.item && (
              <div className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-ink-muted">Discussing:</span>
                  <Link
                    to={`/app/items/${activeConversation.item.id}`}
                    className="font-bold text-ink-primary hover:text-brand-600 truncate underline"
                  >
                    {activeConversation.item.title}
                  </Link>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 font-serif shrink-0">
                    INR {activeConversation.item.daily_price || 15}/day
                  </span>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-xs text-ink-muted">
                  <MessageSquare size={24} className="mx-auto mb-2 text-ink-muted/50" />
                  <p className="font-semibold text-ink-primary">No messages yet</p>
                  <p className="mt-1">
                    Send a greeting, ask about item condition, or send a custom rate offer.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  const isSystem = msg.sender_id === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <div className="px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-ink-muted text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
                          <Info size={12} className="text-emerald-600" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                        {!isMe && (
                          <img
                            src={msg.sender_avatar || '/default_avatar_male.svg'}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                          />
                        )}

                        <div className="flex flex-col">
                          {/* SPECIAL OFFER CARD */}
                          {msg.type === 'offer' && msg.payload && (
                            <div className="p-3.5 rounded-2xl bg-surface-card border-2 border-emerald-600/40 shadow-sm flex flex-col gap-2 mb-1">
                              <div className="flex items-center justify-between gap-2 border-b border-surface-border pb-1.5">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                  <Tag size={12} className="text-[#D4A853]" />
                                  <span>Custom Rental Rate Offer</span>
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                    msg.payload.status === 'accepted'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : msg.payload.status === 'declined'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {msg.payload.status}
                                </span>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-extrabold text-[#0F382A] dark:text-emerald-400 font-serif">
                                  INR {msg.payload.daily_price}
                                </span>
                                <span className="text-xs text-ink-muted">/ day for {msg.payload.days} days</span>
                              </div>

                              <div className="p-2 rounded-lg bg-surface-base text-xs space-y-1">
                                <div className="flex justify-between text-ink-muted">
                                  <span>Total Payable:</span>
                                  <span className="font-bold text-ink-primary">
                                    INR {msg.payload.total_amount}
                                  </span>
                                </div>
                                {msg.payload.note && (
                                  <p className="text-[11px] italic text-ink-muted mt-1">
                                    "{msg.payload.note}"
                                  </p>
                                )}
                              </div>

                              {/* Interactive Accept / Decline for the recipient */}
                              {!isMe && msg.payload.status === 'pending' && (
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRespondOffer(msg.id, 'accept')}
                                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>Accept Rate</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRespondOffer(msg.id, 'decline')}
                                    className="py-1.5 px-3 rounded-lg border border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* SPECIAL TRADE PROPOSAL CARD */}
                          {msg.type === 'trade' && msg.payload && (
                            <div className="p-3.5 rounded-2xl bg-surface-card border-2 border-[#D4A853]/50 shadow-sm flex flex-col gap-2 mb-1">
                              <div className="flex items-center justify-between gap-2 border-b border-surface-border pb-1.5">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#916C16] dark:text-[#E8CA7A]">
                                  <ArrowLeftRight size={12} className="text-[#D4A853]" />
                                  <span>Trade / Barter Proposal</span>
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                    msg.payload.status === 'accepted'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : msg.payload.status === 'declined'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {msg.payload.status}
                                </span>
                              </div>

                              <div>
                                <span className="text-xs text-ink-muted">Offered in Exchange:</span>
                                <p className="text-sm font-bold text-ink-primary">
                                  {msg.payload.offered_item}
                                </p>
                              </div>

                              {msg.payload.note && (
                                <p className="text-xs italic text-ink-muted bg-surface-base p-2 rounded-lg">
                                  "{msg.payload.note}"
                                </p>
                              )}

                              {/* Interactive Accept / Decline for the recipient */}
                              {!isMe && msg.payload.status === 'pending' && (
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRespondOffer(msg.id, 'accept')}
                                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#D4A853] hover:bg-[#c29642] text-[#080C0A] font-bold text-xs transition-colors flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>Accept Trade</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRespondOffer(msg.id, 'decline')}
                                    className="py-1.5 px-3 rounded-lg border border-surface-border hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* STANDARD TEXT BUBBLE */}
                          {(!msg.payload || msg.type === 'text') && (
                            <div
                              className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                isMe
                                  ? 'bg-[#0F382A] text-[#F5F2EB] rounded-br-xs'
                                  : 'bg-surface-card text-ink-primary border border-surface-border rounded-bl-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                          )}

                          <span className={`text-[10px] text-ink-muted mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-surface-card border-t border-surface-border flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to negotiate or coordinate..."
                className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl border border-surface-border bg-surface-base text-ink-primary text-xs sm:text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!inputText.trim() || sending}
                className="h-[42px] px-4 rounded-xl gap-1.5"
              >
                <Send size={15} />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center text-ink-muted bg-surface-base">
            <div>
              <MessageSquare size={36} className="mx-auto mb-3 text-ink-muted/50" />
              <h3 className="font-bold text-ink-primary text-base">Select a conversation</h3>
              <p className="text-xs text-ink-muted max-w-sm mt-1">
                Choose a conversation from the left to view messages and negotiate rental rates or trades.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* NEGOTIATION / TRADE OFFER MODAL */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title="Propose In-Chat Offer or Trade"
      >
        <div className="flex border-b border-surface-border mb-4">
          <button
            type="button"
            onClick={() => setOfferTab('rental')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              offerTab === 'rental'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <Tag size={13} />
            <span>Negotiate Rental Rate</span>
          </button>
          <button
            type="button"
            onClick={() => setOfferTab('trade')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              offerTab === 'trade'
                ? 'border-[#D4A853] text-[#916C16] dark:text-[#E8CA7A]'
                : 'border-transparent text-ink-muted hover:text-ink-primary'
            }`}
          >
            <ArrowLeftRight size={13} />
            <span>Propose Item Trade</span>
          </button>
        </div>

        {offerError && (
          <div className="p-3 mb-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
            {offerError}
          </div>
        )}

        <form onSubmit={handleSendOffer} className="flex flex-col gap-3.5">
          {offerTab === 'rental' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink-primary">
                    Proposed Daily Rate (INR / day)
                  </label>
                  <input
                    type="number"
                    min={MIN_RENTAL_PRICE}
                    max={CATEGORY_PRICE_LIMITS[activeConversation?.item?.category] || 50}
                    value={offerData.dailyPrice}
                    onChange={(e) => setOfferData({ ...offerData, dailyPrice: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-lg border border-surface-border bg-surface-card text-xs font-bold"
                    required
                  />
                  <span className="text-[10px] text-ink-muted">
                    Max allowed: INR {CATEGORY_PRICE_LIMITS[activeConversation?.item?.category] || 50}/day
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink-primary">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={offerData.days}
                    onChange={(e) => setOfferData({ ...offerData, days: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-lg border border-surface-border bg-surface-card text-xs font-bold"
                    required
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="p-3 rounded-xl bg-surface-base border border-surface-border text-xs flex flex-col gap-1">
                <div className="flex justify-between text-ink-muted">
                  <span>Gross Rental:</span>
                  <span>INR {offerData.dailyPrice * offerData.days}</span>
                </div>
                <div className="flex justify-between text-ink-muted text-[11px]">
                  <span>BorrowBox Fee (20%):</span>
                  <span>INR {Math.round(offerData.dailyPrice * offerData.days * 0.2)}</span>
                </div>
                <div className="flex justify-between text-ink-muted text-[11px]">
                  <span>Owner Payout (80%):</span>
                  <span>INR {Math.round(offerData.dailyPrice * offerData.days * 0.8)}</span>
                </div>
                <div className="flex justify-between font-bold text-ink-primary pt-1 border-t border-surface-border">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-serif">
                    INR {offerData.dailyPrice * offerData.days}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-primary">
                  Note to Student (e.g. Reason for discount)
                </label>
                <textarea
                  rows={2}
                  value={offerData.note}
                  onChange={(e) => setOfferData({ ...offerData, note: e.target.value })}
                  placeholder="e.g. Taking it for 5 straight days for exams..."
                  className="w-full p-2.5 rounded-lg border border-surface-border text-xs outline-none bg-surface-card text-ink-primary"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-primary">
                  What item will you trade? <span className="text-state-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Casio fx-991CW Calculator or Puma Sports Shoes"
                  value={offerData.offeredItem}
                  onChange={(e) => setOfferData({ ...offerData, offeredItem: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-surface-border bg-surface-card text-xs font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-primary">
                  Trade Notes / Condition Description
                </label>
                <textarea
                  rows={2}
                  value={offerData.note}
                  onChange={(e) => setOfferData({ ...offerData, note: e.target.value })}
                  placeholder="Describe condition, model, and meetup area..."
                  className="w-full p-2.5 rounded-lg border border-surface-border text-xs outline-none bg-surface-card text-ink-primary"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
            <Button variant="outline" size="sm" onClick={() => setIsOfferModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {offerTab === 'rental' ? 'Send Rental Offer' : 'Send Trade Proposal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Holographic Campus Student ID Modal */}
      {selectedProfileUserId && (
        <PublicProfileModal
          userId={selectedProfileUserId}
          isOpen={Boolean(selectedProfileUserId)}
          onClose={() => setSelectedProfileUserId(null)}
        />
      )}
    </PageContainer>
  );
};

export default MessagesPage;

