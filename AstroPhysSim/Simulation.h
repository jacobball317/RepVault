#ifndef SIMULATION_H
#define SIMULATION_H

#include "CelestialBody.h"
#include <vector>

class Simulation {
public:
    std::vector<CelestialBody> bodies;
    double timeStep;


    Simulation (double timeStep);
    void addBody(const CelestialBody& body);
    void update();
    void simulate(double totalTime);
};

#endif