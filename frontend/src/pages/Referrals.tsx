import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Gift } from 'lucide-react';
import { useI18nStrict } from '../hooks/useI18nStrict';
import { ComicPanel } from '../components/ComicPanel';
import axios from 'axios';

interface ReferralEvent {
  id: number;
  event_type: string;
  points_awarded: number;
  referred_user_id?: number;
  created_at: string;
}

interface ReferralResponse {
  ref_code: string;
  ref_link: string;
  total_referrals: number;
  total_points_from_referrals: number;
  events: ReferralEvent[];
}

export function Referrals() {
  const { t } = useI18nStrict();
  const [referralData, setReferralData] = useState<ReferralResponse | null>(null);
  const [refCode, setRefCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/referrals');
      setReferralData(response.data);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (referralData) {
      try {
        await navigator.clipboard.writeText(referralData.ref_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleClaimCode = async () => {
    if (!refCode.trim()) return;
    
    try {
      await axios.post('/api/referrals/claim', { ref_code: refCode });
      setRefCode('');
      alert(t('success.referral_claimed'));
    } catch (error) {
      console.error('Failed to claim referral code:', error);
      alert(t('errors.invalid_referral_code'));
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users size={32} />
        <h1 className="text-3xl font-bold">{t('referrals.title')}</h1>
      </div>

      {referralData && (
        <>
          {/* Referral Code */}
          <ComicPanel className="mb-6">
            <h2 className="text-xl font-bold mb-4">{t('referrals.your_code')}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg bg-gray-100 px-3 py-2 rounded">
                  {referralData.ref_code}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="btn btn-sm"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? t('referrals.link_copied') : t('referrals.copy_link')}
                </button>
              </div>
              
              <div className="text-sm text-muted">
                {t('referrals.invite_link')}: {referralData.ref_link}
              </div>
            </div>
          </ComicPanel>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ComicPanel>
              <div className="flex items-center gap-3">
                <Users size={24} className="text-blue-600" />
                <div>
                  <div className="text-sm text-muted">{t('referrals.total_referrals')}</div>
                  <div className="font-bold text-2xl">{referralData.total_referrals}</div>
                </div>
              </div>
            </ComicPanel>

            <ComicPanel>
              <div className="flex items-center gap-3">
                <Gift size={24} className="text-green-600" />
                <div>
                  <div className="text-sm text-muted">{t('referrals.points_earned')}</div>
                  <div className="font-bold text-2xl">{referralData.total_points_from_referrals}</div>
                </div>
              </div>
            </ComicPanel>
          </div>

          {/* Events */}
          {referralData.events.length > 0 && (
            <ComicPanel>
              <h3 className="font-bold mb-4">{t('referrals.points_earned')}</h3>
              <div className="space-y-2">
                {referralData.events.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{event.event_type}</div>
                      <div className="text-sm text-muted">
                        {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="badge badge-success">
                      +{event.points_awarded}
                    </div>
                  </div>
                ))}
              </div>
            </ComicPanel>
          )}
        </>
      )}

      {/* Claim Referral Code */}
      <ComicPanel className="mt-6">
        <h3 className="font-bold mb-4">{t('referrals.claim_code')}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="form-input flex-1"
            placeholder={t('referrals.enter_code')}
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
          />
          <button
            onClick={handleClaimCode}
            className="btn btn-primary"
            disabled={!refCode.trim()}
          >
            {t('referrals.claim_code')}
          </button>
        </div>
      </ComicPanel>
    </div>
  );
}