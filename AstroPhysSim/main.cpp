#include <SFML/Graphics.hpp>
#include "CelestialBody.h"
#include "Simulation.h"

int main() {
    Simulation solarSystem(3600);  // Time step of one hour (in seconds)

    CelestialBody sun("Sun", 1.989e30, 6.9634e8, {0, 0, 0}, {0, 0, 0});
    CelestialBody earth("Earth", 5.972e24, 6.371e6, {1.496e11, 0, 0}, {0, 29780, 0});
    CelestialBody mars("Mars", 6.4171e23, 3.3895e6, {2.279e11, 0, 0}, {0, 24100, 0});

    solarSystem.addBody(sun);
    solarSystem.addBody(earth);
    solarSystem.addBody(mars);

    solarSystem.simulate(86400 * 365);  // Simulate one year in seconds

    return 0;
}
