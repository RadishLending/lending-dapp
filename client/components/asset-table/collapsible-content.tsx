import React, { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Asset, getAssetIcon } from "@/types/asset";
import { TruncatedNumber } from "@/components/ui/truncated-number";
import { getCachedAssetPrice } from "@/lib/price-cache";

interface AssetCollapsibleContentProps {
  asset: Asset;
  onAmountChange: (amount: number) => void;
  onConfirm: (amount: number) => void;
  mode: 'supply' | 'borrow';
}

export function AssetCollapsibleContent({ asset, onAmountChange, onConfirm, mode }: AssetCollapsibleContentProps) {
  const [tempAmount, setTempAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usdValue, setUsdValue] = useState(0);

  useEffect(() => {
    const calculateUsdValue = async () => {
      const amount = parseFloat(tempAmount);
      if (isNaN(amount)) {
        setUsdValue(0);
        return;
      }
      const price = await getCachedAssetPrice(asset.label);
      setUsdValue(amount * price);
    };
    calculateUsdValue();
  }, [tempAmount, asset.label]);

  const handleAmountChange = (value: string) => {
    setTempAmount(value);
    const numValue = Number(value);
    
    if (!isNaN(numValue) && numValue >= 0) {
      onAmountChange(numValue);
    } else {
      onAmountChange(0);
    }
    
    validateAmount(value);
  };

  const validateAmount = (value: string) => {
    const numValue = Number(value);
    const maxAmount = mode === 'borrow'
      ? (asset.available ?? 0)
      : asset.wallet_balance;

    if (isNaN(numValue)) {
      setError("Please enter a valid number");
    } else if (numValue < 0) {
      setError("Amount must be greater than or equal to 0");
    } else if (numValue > maxAmount) {
      setError(`Amount cannot exceed ${maxAmount}`);
    } else {
      setError(null);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = mode === 'borrow'
      ? (asset.available ?? 0)
      : asset.wallet_balance;
    setTempAmount(maxAmount.toString());
    onAmountChange(maxAmount);
    validateAmount(maxAmount.toString());
  };

  return (
    <div className="w-full bg-accent/5 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={getAssetIcon(asset.label)}
          alt={`${asset.label} icon`}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-lg font-semibold text-foreground">{asset.label}</span>
      </div>

      <div className="flex flex-col space-y-3">
        <div className="relative">
          <Input
            type="number"
            value={tempAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="pr-16 bg-background border-accent/20 focus:border-accent/40 placeholder:text-foreground"
            placeholder="0.00"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-accent/10"
            onClick={handleMaxClick}
          >
            Max
          </Button>
        </div>
        <div className="flex justify-between text-sm text-foreground px-1">
          <span>≈ $<TruncatedNumber value={usdValue} /></span>
          {mode === 'borrow' ? (
            <span>Available: <TruncatedNumber value={asset.available ?? 0} /></span>
          ) : (
            <span>Balance: <TruncatedNumber value={asset.wallet_balance} /></span>
          )}
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
      </div>

      <div className="space-y-3 py-2 border-t border-accent/10">
        <div className="flex justify-between text-base text-foreground">
          <span>{mode === 'borrow' ? 'Borrow APR' : 'Supply APR'}</span>
          <span className={mode === 'borrow' ? 'text-destructive' : 'text-success'}>
            {mode === 'borrow' ? '10.00' : Number(asset.APR).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
} 