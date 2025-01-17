"use client"
import React, { useState, useEffect, useContext } from "react";
import profile from "../../../../images/goldeng.png";
import ArrowIcon from "../../../../images/arrow.svg";
import memeicon from "../../../../images/memeicon.png";
import { AppSocialPoint } from '../../../utils/axiossonfig';
import { TransactionContext } from '../../../context/TransactionContext';

function Comments({ contractMeme, chainNetwork, Comments }) {
    const [allcomments, setDataComments] = useState([]);
    const [media, setMedia] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const { currentAccount } = useContext(TransactionContext);
    const [showConnectWalletMessage, setShowConnectWalletMessage] = useState(false); // Estado para mostrar el mensaje

    useEffect(() => {
        if (Comments && Array.isArray(Comments)) {
            setDataComments(Comments);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [Comments]);

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setMedia(fileUrl);

            return () => URL.revokeObjectURL(fileUrl);
        }
    };

    const handleAddComment = async () => {
        if (!currentAccount) {
            setShowConnectWalletMessage(true); // Mostrar mensaje de conectar wallet
            
            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                setShowConnectWalletMessage(false);
            }, 5000); 

            return;
        }

        setShowConnectWalletMessage(false); // Ocultar mensaje si la wallet está conectada

        const nonderesponse = await AppSocialPoint.get(`/generateNonce/${currentAccount}`);
        const nonce = nonderesponse.data.nonce;
        console.log(nonce, "nonce code")

        if (newComment.trim() || media) {
            const newCommentData = {
                text: newComment,
                media,
                tableName: contractMeme, 
                chainNet: chainNetwork,
                walletAddress: currentAccount, 
                nonce,
            };

            try {
                //const response = await axios.post("https://app-social-gg.onrender.com/comments", newCommentData);

                const response = await AppSocialPoint.post('/comments', newCommentData);

                setDataComments([response.data, ...allcomments]); // Usar la respuesta del servidor
            } catch (error) {
                console.error("Error adding comment:", error);
                // Aquí puedes añadir un mensaje para notificar al usuario sobre el error
            }    

            setNewComment("");
            setMedia(null);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center">
                            <img
                                src={profile}
                                alt="Profile"
                                className="h-full w-full rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <input
                            type="text"
                            className="rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Add a comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <div className="flex flex-fil items-center mt-2">
                            <label htmlFor="mediaUpload" className="cursor-pointer bg-white rounded-3xl">
                                <img src={memeicon} alt="Upload Icon" className="w-5 h-5 text-gray-400 hover:text-white" />
                            </label>
                            <input 
                                type="file" 
                                accept="image/*,video/*" 
                                onChange={handleMediaUpload} 
                                className="hidden" 
                                id="mediaUpload" 
                            />
                                                    {/* Mostrar mensaje solo cuando se intenta enviar y no hay wallet conectada */}
                        {showConnectWalletMessage && (
                            <p className="text-red-500 text-xs mt-1">  !Connect wallet!</p>
                        )}
                        </div>

                    </div>
                    <button
                        onClick={handleAddComment}
                        className="bg-indigo-500 text-white rounded-full mb-7 p-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <img src={ArrowIcon} alt="Arrow Icon" className="w-4 h-4" />
                    </button>
                </div>

                {media && (
                    <div className="relative mt-2">
                        <img src={media} alt="preview" className="max-w-xs rounded" />
                        <button onClick={() => setMedia(null)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs">
                            X
                        </button>
                    </div>
                )}

                <div className="bg-gray-900 rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
                    {loading ? (
                        <div className="text-gray-400 text-center">Cargando...</div>
                    ) : (
                        allcomments.map((comment, index) => (
                            <div key={index} className="text-sm text-gray-300"> 
                                <span className="font-semibold text-white">{comment.walletAddress.slice(0, 3)}...{comment.walletAddress.slice(-3)}:</span> {comment.text}
                                {comment.media && (
                                    <div className="mt-2">
                                        <img src={comment.media} alt="media" className="max-w-xs rounded" />
                                    </div>
                                )}
                                <div className="text-xs text-gray-500">
                                {new Date(comment.date * 1).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Comments;
