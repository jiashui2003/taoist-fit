import React, { useState, useRef } from 'react';
import { X, Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import { ExtendedHealthMetrics } from '../types';
import { db } from '../services/DatabaseService';

interface ImportDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess?: () => void;
}

interface ImportResult {
    success: boolean;
    message: string;
    count?: number;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
    isOpen,
    onClose,
    onImportSuccess,
}) => {
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            setPreviewData(data);
            setResult(null);
        } catch (error) {
            setResult({
                success: false,
                message: '文件解析失败，请确保是有效的JSON格式',
            });
        }
    };

    const handleImport = async () => {
        if (!previewData) return;

        setIsImporting(true);
        try {
            let importCount = 0;

            // 处理健康数据数组
            if (Array.isArray(previewData)) {
                for (const item of previewData) {
                    if (item.date && item.metrics) {
                        await db.saveHealthMetrics(item.date, item.metrics as ExtendedHealthMetrics);
                        importCount++;
                    }
                }
            }
            // 处理单日数据
            else if (previewData.date && previewData.metrics) {
                await db.saveHealthMetrics(previewData.date, previewData.metrics);
                importCount = 1;
            }
            // 处理指标历史
            else if (previewData.metricHistory && Array.isArray(previewData.metricHistory)) {
                for (const record of previewData.metricHistory) {
                    if (record.metricKey && typeof record.value === 'number') {
                        await db.saveMetricHistory(
                            record.metricKey,
                            record.value,
                            record.source || 'imported'
                        );
                        importCount++;
                    }
                }
            }

            if (importCount > 0) {
                setResult({
                    success: true,
                    message: `成功导入 ${importCount} 条数据`,
                    count: importCount,
                });
                onImportSuccess?.();
            } else {
                setResult({
                    success: false,
                    message: '未找到有效的健康数据，请检查数据格式',
                });
            }
        } catch (error) {
            setResult({
                success: false,
                message: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`,
            });
        } finally {
            setIsImporting(false);
        }
    };

    const resetModal = () => {
        setPreviewData(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[#FDFCF8] rounded-2xl w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#E6E2D0]">
                    <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                        <Upload size={20} className="text-[#9C7D3C]" />
                        导入修炼数据
                    </h2>
                    <button
                        onClick={() => { resetModal(); onClose(); }}
                        className="p-2 hover:bg-[#E6E2D0] rounded-full transition-colors"
                    >
                        <X size={20} className="text-[#4A4A4A]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* 文件选择 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                            选择JSON文件
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#D4CEB0] rounded-xl p-6 text-center cursor-pointer hover:border-[#9C7D3C] transition-colors"
                        >
                            <FileJson size={32} className="mx-auto mb-2 text-[#9C7D3C]" />
                            <p className="text-sm text-[#4A4A4A]">点击选择或拖放JSON文件</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* 数据预览 */}
                    {previewData && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                                数据预览
                            </label>
                            <pre className="bg-[#F2F0E6] rounded-lg p-3 text-xs overflow-x-auto max-h-32">
                                {JSON.stringify(previewData, null, 2).substring(0, 500)}
                                {JSON.stringify(previewData).length > 500 && '...'}
                            </pre>
                        </div>
                    )}

                    {/* 结果提示 */}
                    {result && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${result.success
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                            {result.success
                                ? <CheckCircle size={18} />
                                : <AlertCircle size={18} />
                            }
                            <span className="text-sm">{result.message}</span>
                        </div>
                    )}

                    {/* 数据格式说明 */}
                    <div className="text-xs text-[#6A6A6A] mb-4">
                        <p className="font-medium mb-1">支持的数据格式:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>{'[{ date: "YYYY-MM-DD", metrics: {...} }]'}</li>
                            <li>{'{ metricHistory: [{ metricKey, value, timestamp }] }'}</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-4 border-t border-[#E6E2D0]">
                    <button
                        onClick={() => { resetModal(); onClose(); }}
                        className="flex-1 py-2 rounded-lg border border-[#D4CEB0] text-[#4A4A4A] hover:bg-[#E6E2D0] transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!previewData || isImporting}
                        className="flex-1 py-2 rounded-lg bg-[#9C7D3C] text-white hover:bg-[#8A6B2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isImporting ? '导入中...' : '确认导入'}
                    </button>
                </div>
            </div>
        </div>
    );
};
