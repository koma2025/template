import { useCallback } from "react";
import Particles from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                particles: {
                    color: {
                        value: "#ef4444",
                    },
                    links: {
                        color: "#ef4444",
                        distance: 250,
                        enable: true,
                        opacity: 2.5,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        random: false,
                        speed: 5,
                        straight: false,
                    },
                    number: {
                        value: 90,
                        density: {
                            enable: true,
                            value: 800
                        }
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticleBackground; 