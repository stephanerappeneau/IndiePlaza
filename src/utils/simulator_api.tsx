import simulatorParams from '@/data/simulator_params.json';

export function fetchSimulatorParams(): Promise<typeof simulatorParams> {
  return Promise.resolve(simulatorParams);
}
