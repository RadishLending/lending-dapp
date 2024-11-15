/* ------------------ Imports ----------------- */
use crate::pool::Pool;
use scrypto::prelude::*;

/* --------------- Asset Struct --------------- */
// TODO: Implement non-fixed APY and utilization
// TODO: Create functions to disable asset operations
#[derive(Clone, ScryptoSbor, Debug)]
pub struct AssetEntry {
    pub address: ResourceAddress,
    pub resource_manager: ResourceManager,

    pub pool: Pool,

    pub name: String,
    pub symbol: String,
    // pub description: String,
    pub apy: PreciseDecimal, // 0.1 == 10%
    pub utilization: PreciseDecimal,
}

impl AssetEntry {
    /* ------------------- Inits ------------------ */
    pub fn new(address: ResourceAddress, pool: Pool) -> AssetEntry {
        let resource_manager: ResourceManager = ResourceManager::from_address(address.clone());

        let name: String = resource_manager.get_metadata("name").expect("Cannot get asset name").expect("Asset name is None");
        let symbol: String = resource_manager.get_metadata("symbol").expect("Cannot get asset symbol").expect("Asset symbol is None");
        // let description: String = resource_manager.get_metadata("description").expect("Cannot get asset description").expect("Asset description is None");

        let apy: PreciseDecimal = pdec!(0.1);
        let utilization: PreciseDecimal = pdec!(0.0);

        AssetEntry {
            address,
            resource_manager,

            pool,

            name,
            symbol,
            // description
            apy,
            utilization,
        }
    }

    /* ------------------ Methods ----------------- */
    // ! All of these methods are mockups; to be replaced when dynamic APY and utilization is implemented
    pub fn update(&mut self) {
        self.apy = self.calc_apy();
        self.utilization = self.calc_utilization();
    }

    pub fn calc_apy(&self) -> PreciseDecimal {
        pdec!(0.1)
    }

    pub fn calc_utilization(&self) -> PreciseDecimal {
        pdec!(0.0)
    }
}

/* ------------------ Assets ------------------ */
pub const ADDRESSES: [ResourceAddress; 1] = [XRD];
