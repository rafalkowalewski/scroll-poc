import React, {FC, useEffect, useLayoutEffect, useRef} from 'react';
import './App.css';

const test: HTMLImageElement[] = []

const App: FC = () => {
    const html = document.documentElement;
    const canvas = useRef<HTMLCanvasElement>(null)
    const lastFrame = 336;
    const img = new Image()

    useEffect(() => {
        for (let i = 0; i <= lastFrame; i++) {
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
        window.scroll({top: frameIndex, behavior: 'smooth'})
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
        const frameIndex = Math.min(lastFrame, Math.ceil(scrollFraction * lastFrame));
        return calculateCurrentFrame(frameIndex);
    }

    return (
        <div>
            <canvas ref={canvas}/>
            <div className={'navigation'}>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(700)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(1288)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(1968)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(2517)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(3525)}/>
            </div>
        </div>
    );
};

export default App;
