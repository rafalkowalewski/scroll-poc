import React, {FC, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './App.css';

const test: HTMLImageElement[] = []

const App: FC = () => {
    const html = document.documentElement;
    const canvas = useRef<HTMLCanvasElement>(null)
    const [currentFrame, setCurrentFrameNumber] = useState(0);
    const lastFrameNumber = 336;
    const img = new Image()

    useEffect(() => {
        for (let i = 0; i <= lastFrameNumber; i++) {
            const temporaryImg = new Image();
            temporaryImg.src = calculateCurrentFrame(i);
            test.push(temporaryImg);
        }
        img.src = calculateCurrentFrameByScrollPosition();
        img.onload = () => {
            canvas.current!.width = img.width;
            canvas.current!.height = img.height;
            drawImage();
        };
    }, []);

    useLayoutEffect(() => {
        const handleScroll = () => {
            img.src = calculateCurrentFrameByScrollPosition();
            requestAnimationFrame(() => drawImage());
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToClick = (frameIndex: number) => {
        const scrollTop = calculateScrollPositionByFrameNumber(frameIndex);
        window.scroll({top: scrollTop, behavior: 'smooth'})
    }

    const drawImage = () => {
        canvas.current!.getContext("2d")!.drawImage(
            img,
            canvas.current!.width / 2 - img.width / 2,
            canvas.current!.height / 2 - img.height / 2
        );
    }

    const calculateCurrentFrame = (index: number) => {
        return `/scroll-animation/220204_ZEISS_CataractWeb_006_${index.toString().padStart(5, '0')}.jpg`;
    };

    const calculateCurrentFrameByScrollPosition = () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(lastFrameNumber, Math.ceil(scrollFraction * lastFrameNumber));
        setCurrentFrameNumber(frameIndex);
        return calculateCurrentFrame(frameIndex);
    }

    const calculateScrollPositionByFrameNumber = (frame: number) => {
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const scrollFraction = frame / lastFrameNumber;
        return maxScrollTop * scrollFraction;
    }

    return (
        <div>
            <canvas ref={canvas}/>
            <div className={'navigation'}>
                <span
                    className={`navigation__bullet ${currentFrame < 67 ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(0)}
                />
                <span
                    className={`navigation__bullet ${currentFrame >= 67 && currentFrame < 123 ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(67)}
                />
                <span
                    className={`navigation__bullet ${currentFrame >= 123 && currentFrame < 188 ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(123)}
                />
                <span
                    className={`navigation__bullet ${currentFrame >= 188 && currentFrame <= 240 ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(188)}
                />
                <span
                    className={`navigation__bullet ${currentFrame >= 240 && currentFrame < lastFrameNumber ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(240)}
                />
                <span
                    className={`navigation__bullet ${currentFrame === lastFrameNumber ? 'navigation__bullet--active' : ''}`}
                    onClick={() => handleScrollToClick(lastFrameNumber)}
                />
            </div>
        </div>
    );
};

export default App;
