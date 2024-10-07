#include "Simulation.h"
#include <cmath>

//simulate(): Advances the simulation by repeatedly calling the update() method.

Simulation::Simulation(double timeStep) : timeStep(timeStep) {}


//addBody(): Adds a celestial body to the simulation.

void Simulation::addBody(const CelestialBody& body) {
    bodies.push_back(body);
}


//update(): Calculates gravitational forces and updates each body's position and velocity.

void Simulation::update() {
    const double G = 6.67430e-11;  // Gravitational constant

    for (auto& body1 : bodies) {
        std::array<double, 3> netForce = {0.0, 0.0, 0.0};

        // Calculate net gravitational force exerted on body1 by other bodies
        for (const auto& body2 : bodies) {
            if (&body1 != &body2) {
                double distance = std::sqrt(
                    std::pow(body2.position[0] - body1.position[0], 2) +
                    std::pow(body2.position[1] - body1.position[1], 2) +
                    std::pow(body2.position[2] - body1.position[2], 2));

                double forceMagnitude = G * (body1.mass * body2.mass) / (distance * distance);

                // Calculate force vector
                std::array<double, 3> direction = {
                    (body2.position[0] - body1.position[0]) / distance,
                    (body2.position[1] - body1.position[1]) / distance,
                    (body2.position[2] - body1.position[2]) / distance
                };
                
                netForce[0] += forceMagnitude * direction[0];
                netForce[1] += forceMagnitude * direction[1];
                netForce[2] += forceMagnitude * direction[2];
            }
        }

        // Update velocity and position using the net force
        body1.velocity[0] += (netForce[0] / body1.mass) * timeStep;
        body1.velocity[1] += (netForce[1] / body1.mass) * timeStep;
        body1.velocity[2] += (netForce[2] / body1.mass) * timeStep;

        body1.position[0] += body1.velocity[0] * timeStep;
        body1.position[1] += body1.velocity[1] * timeStep;
        body1.position[2] += body1.velocity[2] * timeStep;
    }
}
