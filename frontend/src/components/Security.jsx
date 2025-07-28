import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShield,
    faDesktop,
    faMobileAlt,
    faTabletAlt,
    faTrash,
    faTimes,
    faExclamationTriangle,
    faCheckCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PropTypes from 'prop-types';

const Security = ({ isVisible, onClose }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sessionToRevoke, setSessionToRevoke] = useState(null);
    const [showRevokeAllModal, setShowRevokeAllModal] = useState(false);
    const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

    const fetchActiveSessions = useCallback(async () => {
        setLoading(true);
        setError('');

        const sessionId = localStorage.getItem('sessionId');
        const headers = {};
        if (sessionId) headers['X-Session-ID'] = sessionId;

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/sessions`,
                {
                    headers,
                    withCredentials: true,
                }
            );

            if (response.data.statusCode === 200) {
                setSessions(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch sessions');
            console.error('Error fetching sessions:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const revokeSession = async (sessionId) => {
        try {
            setError('');
            const currentSessionId = localStorage.getItem('sessionId');
            const headers = {};
            if (currentSessionId) headers['X-Session-ID'] = currentSessionId;

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/sessions/${sessionId}`,
                {
                    headers,
                    withCredentials: true
                }
            );

            if (response.data.statusCode === 200) {
                setSessions(prev => prev.filter(session => session.sessionId !== sessionId));
                setShowConfirmModal(false);
                setSessionToRevoke(null);
                setError('Session revoked successfully');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            console.error('Error revoking session:', err);
            setError(err.response?.data?.message || 'Failed to revoke session');
        }
    };

    const revokeAllSessions = async () => {
        try {
            setError('');
            const currentSessionId = localStorage.getItem('sessionId');
            const headers = {};
            if (currentSessionId) headers['X-Session-ID'] = currentSessionId;

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/sessions/revoke-all`,
                {},
                {
                    headers,
                    withCredentials: true
                }
            );

            if (response.data.statusCode === 200) {
                setSessions(prev => prev.filter(session => session.isCurrent));
                setShowRevokeAllModal(false);
                setError('All other sessions revoked successfully');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            console.error('Error revoking all sessions:', err);
            setError(err.response?.data?.message || 'Failed to revoke all sessions');
        }
    };

    const logoutFromAllDevices = async () => {
        try {
            const currentSessionId = localStorage.getItem('sessionId');
            const headers = {};
            if (currentSessionId) headers['X-Session-ID'] = currentSessionId;

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout-all-devices`,
                {},
                {
                    headers,
                    withCredentials: true
                }
            );

            if (response.data.statusCode === 200) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('sessionId');
                window.location.href = '/signin';
            }
        } catch (err) {
            setError('Failed to logout from all devices');
            console.error('Error logging out from all devices:', err);
        }
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType?.toLowerCase()) {
            case 'mobile': return faMobileAlt;
            case 'tablet': return faTabletAlt;
            default: return faDesktop;
        }
    };

    const getBrowserIcon = (browserName) => {
        const browser = browserName?.toLowerCase() || '';
        if (browser.includes('chrome')) return '🌐';
        if (browser.includes('firefox')) return '🦊';
        if (browser.includes('safari')) return '🧭';
        if (browser.includes('edge')) return '🔷';
        if (browser.includes('opera')) return '🎭';
        if (browser.includes('brave')) return '🦁';
        return '🌐';
    };

    const getOSIcon = (osName) => {
        const os = osName?.toLowerCase() || '';
        if (os.includes('windows')) return '🪟';
        if (os.includes('mac')) return '🍎';
        if (os.includes('linux')) return '🐧';
        if (os.includes('android')) return '🤖';
        if (os.includes('ios')) return '📱';
        return '💻';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getLocationFromIP = (ip) => {
        return ip === '::1' || ip === '127.0.0.1' ? 'Local Device' : ip;
    };

    useEffect(() => {
        if (isVisible) fetchActiveSessions();
    }, [isVisible, fetchActiveSessions]);

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-[#28282B] sm:w-4/5 md:w-3/5 lg:w-2/5 w-11/12 max-h-[90vh] rounded-3xl p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faShield} className="text-blue-400 mr-3 text-xl" />
                            <h2 className="text-xl text-white font-semibold font-poppins">Security & Sessions</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    {error && (
                        <div className={`px-4 py-3 rounded-lg mb-4 ${error.includes('successfully')
                                ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-300'
                                : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-300'
                            }`}>
                            <FontAwesomeIcon
                                icon={error.includes('successfully') ? faCheckCircle : faExclamationTriangle}
                                className="mr-2"
                            />
                            {error}
                        </div>
                    )}

                    {/* Current Session Summary */}
                    {sessions.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-20 border border-blue-400 rounded-xl p-4 mb-6">
                            <h3 className="text-white font-semibold font-poppins mb-3 flex items-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mr-2" />
                                Your Current Session
                            </h3>
                            {sessions.filter(session => session.isCurrent).map((currentSession) => (
                                <div key={currentSession.sessionId} className="flex items-center space-x-3">
                                    <span className="text-2xl">
                                        {getBrowserIcon(currentSession.deviceInfo?.browserName)}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-white font-medium font-poppins">
                                            {currentSession.deviceInfo?.browser || 'Unknown Browser'}
                                        </p>
                                        <p className="text-gray-300 text-sm font-poppins">
                                            {getOSIcon(currentSession.deviceInfo?.osName)} {currentSession.deviceInfo?.os} •
                                            <span className="capitalize ml-1">{currentSession.deviceInfo?.deviceType}</span> •
                                            <span className="ml-1">{getLocationFromIP(currentSession.ipAddress)}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-400 text-xs font-poppins">Active Now</p>
                                        <p className="text-gray-400 text-xs font-poppins">
                                            Since {formatDate(currentSession.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg text-white font-medium font-poppins">All Active Sessions</h3>
                            <p className="text-gray-400 text-sm font-poppins">
                                {sessions.length} active session{sessions.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        {sessions.length > 1 && (
                            <button
                                onClick={() => setShowRevokeAllModal(true)}
                                className="text-red-400 hover:text-red-300 text-sm font-poppins transition-colors flex items-center"
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                Revoke All Others
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <FontAwesomeIcon icon={faSpinner} className="text-blue-400 text-2xl animate-spin" />
                                <span className="text-white ml-3 font-poppins">Loading sessions...</span>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-12">
                                <FontAwesomeIcon icon={faShield} className="text-gray-500 text-4xl mb-4" />
                                <div className="text-gray-400 font-poppins">
                                    <h4 className="text-lg mb-2">No Active Sessions</h4>
                                    <p className="text-sm">No active sessions found. Please try refreshing.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Current Session First */}
                                {sessions.filter(session => session.isCurrent).map((session) => (
                                    <div
                                        key={session.sessionId}
                                        className="bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20 rounded-xl p-4 border border-green-400"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4">
                                                <div className="text-3xl">
                                                    <FontAwesomeIcon
                                                        icon={getDeviceIcon(session.deviceInfo?.deviceType)}
                                                        className="text-green-400"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-2xl mr-2">
                                                            {getBrowserIcon(session.deviceInfo?.browserName)}
                                                        </span>
                                                        <h4 className="text-white font-semibold font-poppins text-lg">
                                                            {session.deviceInfo?.browser || 'Unknown Browser'}
                                                        </h4>
                                                        <span className="ml-3 flex items-center text-green-400 text-sm font-poppins bg-green-500 bg-opacity-20 px-2 py-1 rounded-full">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                                            Current Device
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                                        <div className="bg-[#1a1a1a] rounded-lg p-3">
                                                            <p className="text-gray-400 text-xs font-poppins mb-1">Operating System</p>
                                                            <div className="flex items-center">
                                                                <span className="text-lg mr-2">{getOSIcon(session.deviceInfo?.osName)}</span>
                                                                <span className="text-white text-sm font-poppins">
                                                                    {session.deviceInfo?.os || 'Unknown OS'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-[#1a1a1a] rounded-lg p-3">
                                                            <p className="text-gray-400 text-xs font-poppins mb-1">Device Type</p>
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-white font-poppins capitalize">
                                                                    {session.deviceInfo?.deviceType || 'Unknown'} Device
                                                                </span>
                                                                {session.deviceInfo?.architecture && (
                                                                    <span className="ml-2 text-gray-400 text-xs">
                                                                        ({session.deviceInfo.architecture})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Location:</span> {getLocationFromIP(session.ipAddress)}
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Session Started:</span> {formatDate(session.createdAt)}
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Last Active:</span> {formatDate(session.lastActiveAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Other Sessions */}
                                {sessions.filter(session => !session.isCurrent).map((session) => (
                                    <div
                                        key={session.sessionId}
                                        className="bg-[#2b2b2e] rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-4">
                                                <div className="text-2xl text-blue-400">
                                                    <FontAwesomeIcon
                                                        icon={getDeviceIcon(session.deviceInfo?.deviceType)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <span className="text-xl mr-2">
                                                            {getBrowserIcon(session.deviceInfo?.browserName)}
                                                        </span>
                                                        <h4 className="text-white font-medium font-poppins">
                                                            {session.deviceInfo?.browser || 'Unknown Browser'}
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">OS:</span>
                                                            <span className="ml-1">{getOSIcon(session.deviceInfo?.osName)}</span>
                                                            <span className="ml-1">{session.deviceInfo?.os || 'Unknown'}</span>
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Device:</span>
                                                            <span className="ml-1 capitalize">{session.deviceInfo?.deviceType || 'Unknown'}</span>
                                                            {session.deviceInfo?.architecture && (
                                                                <span className="ml-1 text-gray-400">({session.deviceInfo.architecture})</span>
                                                            )}
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Location:</span> {getLocationFromIP(session.ipAddress)}
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Started:</span> {formatDate(session.createdAt)}
                                                        </p>
                                                        <p className="text-gray-300 text-sm font-poppins">
                                                            <span className="text-gray-500">Last Active:</span> {formatDate(session.lastActiveAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSessionToRevoke(session);
                                                    setShowConfirmModal(true);
                                                }}
                                                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                                                title="Revoke this session"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-600 space-y-3">
                        <button
                            onClick={fetchActiveSessions}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                        >
                            Refresh Sessions
                        </button>

                        {/* Logout from all devices button */}
                        <button
                            onClick={() => setShowLogoutAllModal(true)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                        >
                            Logout from All Devices
                        </button>

                        {/* Debug button - remove in production */}
                        <button
                            onClick={() => {
                                const token = localStorage.getItem('accessToken');
                                const sessionId = localStorage.getItem('sessionId');
                                alert(`SessionId: ${sessionId || 'Missing'}\nToken: ${token ? 'Present' : 'Missing'}`);
                            }}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors text-sm"
                        >
                            🐛 Debug Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm Revoke Modal */}
            {showConfirmModal && sessionToRevoke && (
                <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-70">
                    <div className="bg-[#28282B] rounded-xl p-6 w-80">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-3xl mb-4" />
                            <h3 className="text-white text-lg font-semibold font-poppins mb-2">
                                Revoke Session
                            </h3>
                            <p className="text-gray-300 text-sm font-poppins mb-6">
                                Are you sure you want to revoke this session? The user will be logged out immediately.
                            </p>
                            <div className="bg-[#2b2b2e] rounded-lg p-4 mb-6">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">
                                        {getBrowserIcon(sessionToRevoke.deviceInfo?.browserName)}
                                    </span>
                                    <div>
                                        <p className="text-white text-sm font-poppins font-semibold">
                                            {sessionToRevoke.deviceInfo?.browser} on {sessionToRevoke.deviceInfo?.os}
                                        </p>
                                        <p className="text-gray-400 text-xs font-poppins">
                                            {getLocationFromIP(sessionToRevoke.ipAddress)} • {sessionToRevoke.deviceInfo?.deviceType} device
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs font-poppins">
                                    Last active: {formatDate(sessionToRevoke.lastActiveAt)}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSessionToRevoke(null);
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => revokeSession(sessionToRevoke.sessionId)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Revoke
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Revoke All Modal */}
            {showRevokeAllModal && (
                <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-70">
                    <div className="bg-[#28282B] rounded-xl p-6 w-80">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-3xl mb-4" />
                            <h3 className="text-white text-lg font-semibold font-poppins mb-2">
                                Revoke All Other Sessions
                            </h3>
                            <p className="text-gray-300 text-sm font-poppins mb-6">
                                This will log out all other devices except your current session. This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowRevokeAllModal(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={revokeAllSessions}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Revoke All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout All Devices Modal */}
            {showLogoutAllModal && (
                <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-70">
                    <div className="bg-[#28282B] rounded-xl p-6 w-80">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 text-3xl mb-4" />
                            <h3 className="text-white text-lg font-semibold font-poppins mb-2">
                                Logout from All Devices
                            </h3>
                            <p className="text-gray-300 text-sm font-poppins mb-6">
                                This will log you out from all devices including this one. You will need to log in again. This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLogoutAllModal(false)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={logoutFromAllDevices}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-poppins transition-colors"
                                >
                                    Logout All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

Security.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Security;
