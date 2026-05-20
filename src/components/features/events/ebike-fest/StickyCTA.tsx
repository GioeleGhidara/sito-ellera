interface StickyCTAProps {
    visible: boolean;
    onScrollToForm: () => void;
}

export function StickyCTA({ visible, onScrollToForm }: StickyCTAProps) {
    return (
        <div className={`sticky-cta ${visible ? "visible" : ""}`}>
            <button className="sticky-cta-btn" onClick={onScrollToForm}>
                <span>Iscriviti ora</span>
                <span className="sticky-cta-price">€ 20</span>
            </button>
        </div>
    );
}
