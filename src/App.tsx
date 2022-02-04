import React, {FC, useEffect, useLayoutEffect, useRef} from 'react';
import './App.css';

const App: FC = () => {
    const html = document.documentElement;
    const canvas = useRef<HTMLCanvasElement>(null)
    const frameCount = 166;
    const img = new Image()

    useEffect(() => {
        img.src = currentFrame(1);
        canvas.current!.width = 1200;
        canvas.current!.height = 720;
        img.onload = () => draw();
    }, [])

    useLayoutEffect(() => {
        const handleScroll = () => {
            const scrollTop = html.scrollTop;
            const maxScrollTop = html.scrollHeight - window.innerHeight;
            const scrollFraction = scrollTop / maxScrollTop;
            const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
            img.src = currentFrame(frameIndex + 1);
            requestAnimationFrame(() => draw())
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToClick = (frameIndex: number) => {
        window.scroll({top: frameIndex, behavior: 'smooth'})
    }

    const currentFrame = (index: number) => {
        return `/scroll-animation/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
    };

    const draw = () => {
        canvas.current!.getContext("2d")!.drawImage(
            img,
            canvas.current!.width / 2 - img.width / 2,
            canvas.current!.height / 2 - img.height / 2
        );
    }

    return (
        <div>
            <canvas ref={canvas}/>
            <div className={'navigation'}>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(1504)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(2547)}/>
                <span className={'navigation__bullet'} onClick={() => handleScrollToClick(3536)}/>
            </div>
        </div>
    );
};

export default App;
