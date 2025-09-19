'use client';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/ui/morph-dialog';
import { PlusIcon, MousePointerClick, GitCommit, Github, Brush, Eraser, Sparkles, AlertTriangle } from 'lucide-react';

export default function Precautions() {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.05,
        duration: 0.30,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '12px',
        }}
        className='w-full max-w-[60rem] cursor-pointer select-none border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:border-zinc-800 dark:bg-zinc-900/50 mb-5 backdrop-blur-lg'
      >
        <div className="flex items-center justify-between p-3 flex-nowrap">
          <span>
            Read me, before you make your GitHub heatmap
            <i className="pl-1 text-green-700">
              stunningly
            </i>,
            <i className="pl-1 text-green-600">
              dazzlingly
            </i>,
            <i className="pl-1 text-green-500">
              gorgeously
            </i>,
            <i className="pl-1 text-green-400">
              breathtakingly
            </i>,
            <i className="pl-1 text-green-300">
              jaw-droppingly
            </i>,
            beautiful
          </span>
          <PlusIcon size={18} className="text-zinc-500" />
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer className=''>
        <MorphingDialogContent
          style={{
            borderRadius: '24px',
          }}
          className='pointer-events-auto relative flex h-auto w-full max-w-3xl flex-col overflow-hidden border bg-background dark:border-zinc-800 dark:bg-zinc-900'
        >
          <div className='p-6'>
            <MorphingDialogTitle className='text-2xl font-bold text-zinc-950 dark:text-zinc-50'>
              User Guide
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400'>
              Everything you need to know before you start.
            </MorphingDialogSubtitle>

            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 50 },
              }}
              className="text-muted-foreground mt-6 space-y-6 text-sm"
            >
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center">
                  <Sparkles size={18} className="mr-2" /> How It Works
                </h3>
                <p className="mb-5">
                  This tool lets you design a custom contribution graph by "painting" on a heatmap. When you apply your changes, here’s what happens behind the scenes:
                </p>
                <div className='flex flex-col gap-4'>
                  <span className=''>
                    <span className="text-foreground flex items-center"><Github size={16} className="mr-2" /> New Public Repository</span>
                    A new, public repository is created in your connected GitHub account. The repository will be named something like `contrib-art-167...`.
                  </span>
                  <span>
                    <span className="text-foreground flex items-center"><GitCommit size={16} className="mr-2" />Automated Commits</span>
                    The tool automatically generates commits for each day you've painted. The number of commits per day matches the "strength" of the color you used. This is done by making small changes to a `README.md` file in the new repository.
                  </span>
                </div>
                <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/30 flex items-start">
                  <AlertTriangle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Important Note</h4>
                    <p className="text-xs">
                      Applying a complex drawing can generate a large number of commits, and the process may take a while to complete.And also for security purposes, our application does not request repository deletion permissions. Consequently, any repository created by this tool must be deleted manually by you through your GitHub account.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Use Section */}
              <div>
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center">
                  <MousePointerClick size={18} className="mr-2" /> How to Use
                </h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    Use the dropdown menu to select a specific year or view the "Last 12 months".
                  </li>
                  <li>
                    Click the <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">Edit</span> button to reveal the control panel.
                  </li>
                  <li>
                    Pick a color from the control panel. Darker colors represent more commits per day.
                  </li>
                  <li>
                    Choose "Single" to paint one cell at a time, or select a letter. For letters, you can toggle between a 'Small' (4x4) or 'Large' (7x5) size.
                  </li>
                  <li>
                    <span className='inline-flex justify-center items-center'>
                      <Brush size={14} className="mr-1 text-green-500" /> <span className=" mr-1 font-semibold">Left-Click</span> on a heatmap cell to add contributions,
                      <Eraser size={14} className="mr-1 text-red-500" /> <span className="mr-1 font-semibold">Right-Click</span> on a heatmap cell to remove them.
                    </span>
                  </li>
                  <li>
                    When you're happy with your design, click the <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs">Apply Changes</span> button and watch the magic happen!
                  </li>
                </ol>
              </div>
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose className='text-zinc-500 dark:text-zinc-400' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}


{/*
  *
  */}
