import { useEffect, useState } from 'react'
import { FiInbox, FiSend } from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'
import RequestCard from '../components/RequestCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Loader from '../components/Loader.jsx'
import {
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
} from '../services/api.js'

import { useAuth } from '../context/AuthContext.jsx'

const TABS = [
  { key: 'sent', label: 'Sent Requests', icon: FiSend },
  { key: 'received', label: 'Received Requests', icon: FiInbox },
]

export default function MyRequests() {
  const { user } = useAuth()
  const [tab, setTab] = useState('received')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

  const fetchRequests = async () => {

    try {

      setLoading(true);

      let response;

      if (tab === "received") {
        response = await getReceivedRequests();
      } else {
        response = await getSentRequests();
      }

      setRequests(response.data.requests);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  fetchRequests();

}, [tab]);

  const updateStatus = (id, status) => {
    setRequests((reqs) => reqs.map((r) => (r._id === id ? { ...r, status } : r)))
  }

  const handlers = {
  onAccept: async (r) => {

    await acceptRequest(r._id);

    updateStatus(r._id, "Accepted");

  },

  onReject: async (r) => {

    await rejectRequest(r._id);

    updateStatus(r._id, "Rejected");

  },

};

  const filtered = requests;

  return (
    <div className="flex page-enter">
      <Sidebar />
      <div className="container-page flex-1 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">My Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Track skill swaps you\u2019ve sent and received.</p>

        <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === key ? 'bg-white text-primary shadow-soft' : 'text-slate-500'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={tab === 'sent' ? FiSend : FiInbox}
              title={tab === 'sent' ? 'No requests sent yet' : 'No requests received yet'}
              description={
                tab === 'sent'
                  ? 'Browse Explore Skills and send your first swap request.'
                  : 'When another student requests a swap with you, it\u2019ll show up here.'
              }
            />
          ) : (
            filtered.map((r) => <RequestCard key={r._id} request={r} {...handlers} />)
          )}
        </div>
      </div>
    </div>
  )
}
