import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    description: string;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => Promise<void>;
    isSubmitting?: boolean;
}

export function CategoryDialog({
    open,
    onOpenChange,
    name,
    description,
    onNameChange,
    onDescriptionChange,
    onSubmit,
    isSubmitting = false,
}: CategoryDialogProps) {
    const handleSubmit = () => {
        void onSubmit();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-slate-50">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="category-name" className="text-slate-200">
                            Name
                        </Label>
                        <Input
                            id="category-name"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder="Category name"
                            className="bg-slate-900/60 border-slate-700 text-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category-description" className="text-slate-200">
                            Description
                        </Label>
                        <Input
                            id="category-description"
                            value={description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Short description (optional)"
                            className="bg-slate-900/60 border-slate-700 text-slate-50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-slate-300 hover:bg-slate-800"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-slate-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

