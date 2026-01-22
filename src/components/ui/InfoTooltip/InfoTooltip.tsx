'use client';

import { useState, type ReactNode } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';

import styles from './InfoTooltip.module.scss';

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
 * - スマホ: タップでドロワー（ボトムシート）を表示
 */
export const InfoTooltip = ({
  content,
  sx,
  iconSize = 'small',
  ariaLabel = '詳細情報',
  placement = 'bottom',
}: InfoTooltipProps) => {
  const theme = useTheme();
  // スマホ判定 (breakpoint down 'sm')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // スマホ: ダイアログ（オーバーレイ）を使用
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={handleToggle}
          size="small"
          aria-label={ariaLabel}
          sx={{
            padding: '4px',
            ...sx,
          }}
        >
          <HelpOutlineIcon fontSize={iconSize} color="action" />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              margin: 2,
              width: 'calc(100% - 32px)',
              maxWidth: '500px',
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: '#fff',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
          >
            {/* 閉じるボタン */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton onClick={handleClose} size="small" aria-label="閉じる">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            {/* コンテンツ */}
            {content}
          </Box>
        </Dialog>
      </>
    );
  }

  // PC: ツールチップを使用
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Tooltip
          title={content}
          open={open}
          onClose={handleClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          arrow
          placement={placement}
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
              className: styles.tooltip,
            },
            arrow: {
              className: styles.arrow,
            },
          }}
        >
          <IconButton
            onClick={handleToggle}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
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
