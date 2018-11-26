![Peakachu Logo](https://github.com/biocommando/junction2018/blob/master/peakachu.png)
# Peakachu
> Electrifying the local grid! - Pikachuuuuuuuuuuuuuuuuu!

Electrification of heat and mobility are global megatrends. However, the technical breakthrough is putting stress to local electricity grids. Electric heat pumps are becoming more and more popular all over the world. On the first half of 2018 alone, the amount of sold electric vehicles (EVs) increased by 148% compared to the previous year in Finland. Those EVs need to be charged every day. Proud EV owners are arriving home from work at the same time and plugging in their cars. That creates unexpected loads on the local grids, which are not suitable for the existing installed hardware in form of power lines and transformers. Thus, operating a local electricity grid is becoming more challenging every day. The additional loads create an increasing demand for expensive investments in the local grid infrastructure... or does it?

## Reducing investment costs of distribution grids utilizing Smart Adaptive Demand Response
Demand Response has been widely known as a concept to balance renewable based electricity production in the transmission grid. Though until today the need for demand response on this scale of the grid has stayed low, because of the size of the transmission grid itself and the comparably low amount of fluctuating production in the total grid. But independently from the growing share of renewable energies in our grid, another part of the grid will be pushed to its limits just by the peak load of current and future electrified devices: local distribution grids. 

Electrified mobility and heating will add up in measurable higher peak loads on the distribution grids which are becoming a bottleneck for electrification. To cover these uncontrolled peak loads it is necessary to upgrade transformers and even power lines in some cases. This results in very high investment costs for the distribution grid operator. Our project "PEAKachu" can prevent this from happening for most grids. By connecting EV charging stations and electrical heating through the internet of things (IoT), we are able to coordinate all important single loads in the local grid. Key piece of this system is an intelligent cloud hub at which the data from EV chargers and smart thermostats is collected and analysed.

PEAKachu is a service provided to local distribution grid operators. The unique approach is to provide hardware for both EV charging and smart heating, and software for load control and capacity market trade access. This is visualized in a web-based dashboard. The intelligence is divided in two parts: first, priority values are defined for various loads and second, predictive control algorithms for heat load requirements. In this project, we have used four apartment buildings as an example. Each apartment is electrically with electrical heaters and has one EV charging station. Therefore, the infrastructure is seen as a virtual power plant which is regulating the capacity within the local grid. To be more particular, the buildings’ construction is seen as a thermal energy storage while the EVs are seen as electrical dispatchable loads. Vehicle to grid operations are not yet implemented, but the hardware has the ability for it already.

To handle the increasing peak loads, PEAKachu calculates a priority value for every registered load. It includes the load of EV charging stations, building heat demand and other electric appliances. EV charging and electric building heating, represent 4-6 times bigger share of the residential electricity consumption compared to the base load. This enables large interventions into households’ electricity load pattern. 

We don't want the consumer to notice anything of this, all other electric appliances have the highest priority and won't be touched by our system. Next, indoor temperatures need to be sustained at least at a minimum temperature. After those loads, EVs have the next priority with the following model:
-	Low charge
-	Medium charge
-	Fast charge

If there is still load left, say, because there are not enough EVs plugged in, the indoor air temperature is raised to its optimal temperature. The charging of both vehicles and thermal storage is additionally dependent on the day-ahead electricity prices. As long as consumer needs are satisfied, it optimizes based on the current load capacity and the market price for electricity. If the system has spare load left, and no predictive event is coming, the remaining load capacity can be sold to other service providers. 

In addition to smart load mitigation, the smart loads are connected to Fingrid’s Frequency Containment Reserve for Normal Operation (FCR-N) market. This market allows at a minimum of 100kW to participate on the market. As households no not have sufficiently controllable loads, they are aggregated through the provided cloud server. 

The business model for the customer, the grid operator, is to provide the hardware and software for the end-user for free. According to our calculations, the grid operator is saving 52,000€ throughout the lifespan of 20 years in the aforementioned 4 apartment buildings. That accounts to 520€ per apartment per year.

The customer can access its datapoints through a web-based dashboard. Now, he can see in one screen where local bottlenecks are emerging, and which loads can be decreased while others are critical for the end-user. Using standardized protocols, the system is fully scalable and not necessary dependent on one hardware provider. This enables new services and flexible usage of data and resources.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app, both front-end and back-end.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm simulate`

Runs the app, both front-end and back-end, but in higher time frame for simulation purposes.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm backend`

Runs the back-end<br>
@ [http://localhost:3001](http://localhost:3001).

### `npm backend-simulate`

Runs the back-end in simulation mode<br>
@ [http://localhost:3001](http://localhost:3001).


### `npm frontend`

Runs the front-end<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
