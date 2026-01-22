'use client';

import { useState, type ReactNode } from 'react';
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type InfoTooltipProps = {
  /** ツールチップ内に表示するコンテンツ */
  content: ReactNode;
  /** IconButton に適用する sx スタイル */
  sx?: SxProps<Theme>;
  /** アイコンのサイズ (デフォルト: 'small') */
  iconSize?: 'small' | 'medium' | 'inherit';
  /** aria-label (デフォルト: '詳細情報') */
  ariaLabel?: string;
  /** ツールチップの表示位置 (デフォルト: 'bottom') */
  placement?: TooltipProps['placement'];
};

/**
 * インフォメーションツールチップコンポーネント
 *
 * - PC: ホバーでツールチップを表示、placementを尊重
 * - スマホ: タップで表示、bottom固定で安定表示
 */
export const InfoTooltip = ({
  content,
  sx,
  iconSize = 'small',
  ariaLabel = '詳細情報',
  placement = 'bottom',
}: InfoTooltipProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // スマホではbottom固定で安定表示、PCでは指定placementを使用
  const finalPlacement = isMobile ? 'bottom' : placement;

  // スマホでは幅を狭く、PCでは広く設定
  const tooltipMaxWidth = isMobile ? 300 : 500;

  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Tooltip
          title={content}
          open={open}
          onClose={handleTooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          arrow
          placement={finalPlacement}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'flip',
                  enabled: true,
                  options: {
                    fallbackPlacements: ['top', 'bottom', 'left'],
                  },
                },
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altAxis: true,
                    tether: false,
                    padding: 8,
                  },
                },
              ],
            },
            tooltip: {
              sx: {
                backgroundColor: '#fff',
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: '0.875rem',
                padding: '12px 16px',
                maxWidth: tooltipMaxWidth,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              },
            },
            arrow: {
              sx: {
                color: '#fff',
                '&::before': {
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                },
              },
            },
          }}
        >
          <IconButton
            onClick={handleTooltipToggle}
            onMouseEnter={isMobile ? undefined : () => setOpen(true)}
            onMouseLeave={isMobile ? undefined : () => setOpen(false)}
            size="small"
            aria-label={ariaLabel}
            sx={{
              padding: '4px',
              ...sx,
            }}
          >
            <HelpOutlineIcon fontSize={iconSize} color="action" />
          </IconButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};
