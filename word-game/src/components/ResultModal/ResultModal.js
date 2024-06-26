function ResultModal({ show, onClose, words }) {
    if (!show) {
        return null;
    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>Words starting with "{words.length > 0 ? words[0][0].toUpperCase() : ''}"</h2>
                <ul>
                    {words.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
                <button onClick={onClose} style={styles.closeButton}>Close</button>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
    },
};

export default ResultModal;
